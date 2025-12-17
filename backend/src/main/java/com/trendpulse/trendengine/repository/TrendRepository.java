package com.trendpulse.trendengine.repository;

import com.trendpulse.trendengine.model.Trend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Trend entity
 */
@Repository
public interface TrendRepository extends JpaRepository<Trend, Long> {
    
    Optional<Trend> findByTopicAndSubreddit(String topic, String subreddit);
    
    List<Trend> findBySubredditOrderByTrendScoreDesc(String subreddit);
    
    List<Trend> findByStatusOrderByTrendScoreDesc(String status);
    
    @Query("SELECT t FROM Trend t WHERE t.status = 'active' ORDER BY t.trendScore DESC")
    List<Trend> findTopActiveTrends();
    
    @Query("SELECT t FROM Trend t WHERE t.detectedAt >= :since ORDER BY t.trendScore DESC")
    List<Trend> findRecentTrends(Instant since);
    
    @Query("SELECT t FROM Trend t WHERE t.trendScore >= :minScore AND t.status = 'active' ORDER BY t.trendScore DESC")
    List<Trend> findTrendsByMinScore(Double minScore);
    
    long countByStatus(String status);
}
