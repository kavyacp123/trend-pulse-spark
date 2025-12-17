package com.trendpulse.ingestion.repository;

import com.trendpulse.ingestion.model.IngestionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repository for IngestionLog entity
 */
@Repository
public interface IngestionLogRepository extends JpaRepository<IngestionLog, Long> {
    
    List<IngestionLog> findBySubredditOrderByStartedAtDesc(String subreddit);
    
    List<IngestionLog> findByStatusOrderByStartedAtDesc(String status);
    
    List<IngestionLog> findByStartedAtAfterOrderByStartedAtDesc(Instant after);
    
    long countByStatus(String status);
}
