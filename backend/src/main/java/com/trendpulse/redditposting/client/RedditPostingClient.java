package com.trendpulse.redditposting.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trendpulse.auth.model.OAuthToken;
import com.trendpulse.auth.repository.OAuthTokenRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

/**
 * Reddit API client for posting
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedditPostingClient {
    
    private final WebClient.Builder webClientBuilder;
    private final OAuthTokenRepository oauthTokenRepository;
    private final ObjectMapper objectMapper;
    
    @Value("${app.reddit.api-url}")
    private String redditApiUrl;
    
    @Value("${app.reddit.user-agent}")
    private String userAgent;
    
    /**
     * Submit a post to Reddit
     */
    @CircuitBreaker(name = "reddit-api", fallbackMethod = "submitPostFallback")
    @RateLimiter(name = "reddit-api")
    public Map<String, String> submitPost(String subreddit, String title, String content, Long userId) {
        log.info("Submitting post to r/{}: {}", subreddit, title);
        
        // Get user's OAuth token
        OAuthToken token = oauthTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("OAuth token not found for user"));
        
        // Prepare request body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("sr", subreddit);
        requestBody.put("kind", "self");
        requestBody.put("title", title);
        requestBody.put("text", content);
        requestBody.put("api_type", "json");
        
        // Call Reddit API
        WebClient webClient = webClientBuilder.build();
        
        JsonNode response = webClient.post()
                .uri(redditApiUrl + "/api/submit")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token.getAccessToken())
                .header(HttpHeaders.USER_AGENT, userAgent)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        
        return parseSubmitResponse(response);
    }
    
    /**
     * Parse Reddit submit response
     */
    private Map<String, String> parseSubmitResponse(JsonNode response) {
        Map<String, String> result = new HashMap<>();
        
        if (response != null && response.has("json")) {
            JsonNode json = response.get("json");
            
            if (json.has("errors") && json.get("errors").size() > 0) {
                String error = json.get("errors").get(0).toString();
                result.put("status", "error");
                result.put("error", error);
                log.error("Reddit API error: {}", error);
            } else if (json.has("data")) {
                JsonNode data = json.get("data");
                String postId = data.has("id") ? data.get("id").asText() : "";
                String url = data.has("url") ? data.get("url").asText() : "";
                
                result.put("status", "success");
                result.put("postId", postId);
                result.put("url", url);
                
                log.info("Post submitted successfully: {}", url);
            }
        }
        
        return result;
    }
    
    /**
     * Fallback method for circuit breaker
     */
    private Map<String, String> submitPostFallback(String subreddit, String title, String content, Long userId, Exception e) {
        log.error("Reddit API unavailable, fallback triggered: {}", e.getMessage());
        
        Map<String, String> result = new HashMap<>();
        result.put("status", "error");
        result.put("error", "Reddit API temporarily unavailable: " + e.getMessage());
        
        return result;
    }
}
