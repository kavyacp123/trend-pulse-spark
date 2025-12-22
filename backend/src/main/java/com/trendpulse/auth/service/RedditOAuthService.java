package com.trendpulse.auth.service;

import com.trendpulse.auth.dto.AuthResponse;
import com.trendpulse.auth.model.OAuthToken;
import com.trendpulse.auth.model.User;
import com.trendpulse.auth.repository.OAuthTokenRepository;
import com.trendpulse.auth.repository.UserRepository;
import com.trendpulse.common.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.Base64;
import java.util.Map;

/**
 * Reddit OAuth service for handling OAuth flow
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedditOAuthService {
    
    private final UserRepository userRepository;
    private final OAuthTokenRepository oauthTokenRepository;
    private final JwtTokenService jwtTokenService;
    private final WebClient.Builder webClientBuilder;
    
    @Value("${spring.security.oauth2.client.registration.reddit.client-id}")
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.reddit.client-secret}")
    private String clientSecret;
    
    @Value("${spring.security.oauth2.client.registration.reddit.redirect-uri}")
    private String redirectUri;
    
    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    private boolean isMockMode() {
        return "your-reddit-client-id".equals(clientId) || "your_reddit_client_id".equals(clientId);
    }
    
    @Value("${spring.security.oauth2.client.provider.reddit.user-info-uri}")
    private String userInfoUri;
    
    /**
     * Get Reddit authorization URL
     */
    public String getAuthorizationUrl(String state) {
        if (isMockMode()) {
            return "http://localhost:5173/dashboard?mock_auth=true";
        }
        return String.format(
                "https://www.reddit.com/api/v1/authorize?client_id=%s&response_type=code&state=%s&redirect_uri=%s&duration=permanent&scope=identity,read,submit",
                clientId, state, redirectUri
        );
    }
    
    /**
     * Exchange authorization code for access token
     */
    @Transactional
    public AuthResponse handleCallback(String code) {
        if (isMockMode()) {
            log.info("Mocking Reddit OAuth callback for demo user");
            User user = userRepository.findByUsername("demo_analyst")
                    .orElseThrow(() -> new ServiceException("Demo user not found. Please run migrations."));
            
            String jwtAccessToken = jwtTokenService.generateAccessToken(user.getId(), user.getUsername());
            String jwtRefreshToken = jwtTokenService.generateRefreshToken(user.getId(), user.getUsername());
            
            return AuthResponse.builder()
                    .accessToken(jwtAccessToken)
                    .refreshToken(jwtRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenService.getAccessTokenExpiration() / 1000)
                    .user(AuthResponse.UserInfo.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .build())
                    .build();
        }
        // Exchange code for tokens
        Map<String, Object> tokenResponse = exchangeCodeForToken(code);
        
        String accessToken = (String) tokenResponse.get("access_token");
        String refreshToken = (String) tokenResponse.get("refresh_token");
        Integer expiresIn = (Integer) tokenResponse.get("expires_in");
        
        // Get user info from Reddit
        Map<String, Object> userInfo = getUserInfo(accessToken);
        String redditUsername = (String) userInfo.get("name");
        
        // Find or create user
        User user = userRepository.findByUsername(redditUsername)
                .orElseGet(() -> createUser(redditUsername));
        
        // Save or update OAuth token
        saveOAuthToken(user, accessToken, refreshToken, expiresIn);
        
        // Generate JWT tokens
        String jwtAccessToken = jwtTokenService.generateAccessToken(user.getId(), user.getUsername());
        String jwtRefreshToken = jwtTokenService.generateRefreshToken(user.getId(), user.getUsername());
        
        log.info("User {} authenticated via Reddit OAuth", user.getUsername());
        
        return AuthResponse.builder()
                .accessToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenService.getAccessTokenExpiration() / 1000)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .build();
    }
    
    /**
     * Exchange authorization code for access token
     */
    private Map<String, Object> exchangeCodeForToken(String code) {
        String basicAuth = Base64.getEncoder()
                .encodeToString((clientId + ":" + clientSecret).getBytes());
        
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("code", code);
        formData.add("redirect_uri", redirectUri);
        
        WebClient webClient = webClientBuilder.build();
        
        return webClient.post()
                .uri(tokenUri)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + basicAuth)
                .header(HttpHeaders.USER_AGENT, "TrendPulseSpark/1.0")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
    
    /**
     * Get user info from Reddit
     */
    private Map<String, Object> getUserInfo(String accessToken) {
        WebClient webClient = webClientBuilder.build();
        
        return webClient.get()
                .uri(userInfoUri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header(HttpHeaders.USER_AGENT, "TrendPulseSpark/1.0")
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
    
    /**
     * Create new user
     */
    private User createUser(String username) {
        User user = User.builder()
                .username(username)
                .isActive(true)
                .build();
        
        return userRepository.save(user);
    }
    
    /**
     * Save or update OAuth token
     */
    private void saveOAuthToken(User user, String accessToken, String refreshToken, Integer expiresIn) {
        OAuthToken token = oauthTokenRepository.findByUserAndProvider(user, "reddit")
                .orElse(OAuthToken.builder()
                        .user(user)
                        .provider("reddit")
                        .build());
        
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setExpiresAt(Instant.now().plusSeconds(expiresIn));
        
        oauthTokenRepository.save(token);
    }
    
    /**
     * Get Reddit access token for user
     */
    public String getRedditAccessToken(User user) {
        OAuthToken token = oauthTokenRepository.findByUserAndProvider(user, "reddit")
                .orElseThrow(() -> new ServiceException("Reddit OAuth token not found for user"));
        
        if (token.isExpired() && token.getRefreshToken() != null) {
            refreshRedditToken(token);
        }
        
        return token.getAccessToken();
    }
    
    /**
     * Refresh Reddit access token
     */
    private void refreshRedditToken(OAuthToken token) {
        String basicAuth = Base64.getEncoder()
                .encodeToString((clientId + ":" + clientSecret).getBytes());
        
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "refresh_token");
        formData.add("refresh_token", token.getRefreshToken());
        
        WebClient webClient = webClientBuilder.build();
        
        Map<String, Object> response = webClient.post()
                .uri(tokenUri)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + basicAuth)
                .header(HttpHeaders.USER_AGENT, "TrendPulseSpark/1.0")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        
        String newAccessToken = (String) response.get("access_token");
        Integer expiresIn = (Integer) response.get("expires_in");
        
        token.setAccessToken(newAccessToken);
        token.setExpiresAt(Instant.now().plusSeconds(expiresIn));
        
        oauthTokenRepository.save(token);
        
        log.info("Refreshed Reddit token for user: {}", token.getUser().getUsername());
    }
}
