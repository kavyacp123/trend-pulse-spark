package com.trendpulse.auth.controller;

import com.trendpulse.auth.dto.AuthResponse;
import com.trendpulse.auth.dto.LoginRequest;
import com.trendpulse.auth.dto.RefreshTokenRequest;
import com.trendpulse.auth.service.AuthService;
import com.trendpulse.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller for login and token management
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Login with username and password
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
    
    /**
     * Refresh access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody RefreshTokenRequest request) {
        log.info("Token refresh request");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }
    
    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        // This will be implemented with JWT filter
        // For now, return placeholder
        return ResponseEntity.ok(ApiResponse.success("User info retrieved", null));
    }
    
    /**
     * Logout (client-side token removal)
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        log.info("Logout request");
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
