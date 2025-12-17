package com.trendpulse.auth.service;

import com.trendpulse.auth.dto.AuthResponse;
import com.trendpulse.auth.dto.LoginRequest;
import com.trendpulse.auth.model.User;
import com.trendpulse.auth.repository.UserRepository;
import com.trendpulse.common.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service for user login and token management
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtTokenService jwtTokenService;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Authenticate user with username and password
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ServiceException("Invalid username or password"));
        
        if (!user.getIsActive()) {
            throw new ServiceException("User account is inactive");
        }
        
        if (user.getPasswordHash() != null && 
            !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ServiceException("Invalid username or password");
        }
        
        String accessToken = jwtTokenService.generateAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtTokenService.generateRefreshToken(user.getId(), user.getUsername());
        
        log.info("User {} logged in successfully", user.getUsername());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
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
     * Refresh access token using refresh token
     */
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String username = jwtTokenService.extractUsername(refreshToken);
            Long userId = jwtTokenService.extractUserId(refreshToken);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ServiceException("User not found"));
            
            if (!user.getIsActive()) {
                throw new ServiceException("User account is inactive");
            }
            
            String newAccessToken = jwtTokenService.generateAccessToken(user.getId(), user.getUsername());
            
            log.info("Refreshed token for user: {}", username);
            
            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenService.getAccessTokenExpiration() / 1000)
                    .user(AuthResponse.UserInfo.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .build())
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to refresh token: {}", e.getMessage());
            throw new ServiceException("Invalid refresh token");
        }
    }
    
    /**
     * Get user by ID
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ServiceException("User not found"));
    }
    
    /**
     * Get user by username
     */
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException("User not found"));
    }
}
