package com.trendpulse.auth.repository;

import com.trendpulse.auth.model.OAuthToken;
import com.trendpulse.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for OAuthToken entity
 */
@Repository
public interface OAuthTokenRepository extends JpaRepository<OAuthToken, Long> {
    
    Optional<OAuthToken> findByUserAndProvider(User user, String provider);
    
    Optional<OAuthToken> findByAccessToken(String accessToken);
    
    void deleteByUser(User user);
}
