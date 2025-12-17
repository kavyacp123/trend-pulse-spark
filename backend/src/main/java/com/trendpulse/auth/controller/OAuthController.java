package com.trendpulse.auth.controller;

import com.trendpulse.auth.dto.AuthResponse;
import com.trendpulse.auth.service.RedditOAuthService;
import com.trendpulse.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * OAuth controller for Reddit authentication
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth/reddit")
@RequiredArgsConstructor
public class OAuthController {
    
    private final RedditOAuthService redditOAuthService;
    
    /**
     * Get Reddit authorization URL
     */
    @GetMapping("/authorize")
    public ResponseEntity<ApiResponse<String>> authorize() {
        String state = UUID.randomUUID().toString();
        String authUrl = redditOAuthService.getAuthorizationUrl(state);
        
        log.info("Generated Reddit authorization URL with state: {}", state);
        
        return ResponseEntity.ok(ApiResponse.success("Authorization URL generated", authUrl));
    }
    
    /**
     * Handle OAuth callback from Reddit
     */
    @GetMapping("/callback")
    public ResponseEntity<ApiResponse<AuthResponse>> callback(
            @RequestParam("code") String code,
            @RequestParam("state") String state) {
        
        log.info("Received OAuth callback with state: {}", state);
        
        AuthResponse response = redditOAuthService.handleCallback(code);
        
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }
}
