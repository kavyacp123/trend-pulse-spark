package com.trendpulse.ingestion.worker;

import com.trendpulse.ingestion.service.RedditFetchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Scheduled worker for automatic Reddit data ingestion
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledIngestionWorker {
    
    private final RedditFetchService redditFetchService;
    
    @Value("${app.ingestion.subreddits}")
    private List<String> subreddits;
    
    /**
     * Scheduled ingestion job
     * Runs based on cron expression in application.yml
     */
    @Scheduled(cron = "${app.ingestion.schedule.cron}")
    public void runScheduledIngestion() {
        log.info("Starting scheduled Reddit ingestion for {} subreddits", subreddits.size());
        
        try {
            var logs = redditFetchService.fetchFromSubreddits(subreddits);
            
            long successful = logs.stream()
                    .filter(l -> "completed".equals(l.getStatus()))
                    .count();
            
            long failed = logs.stream()
                    .filter(l -> "failed".equals(l.getStatus()))
                    .count();
            
            log.info("Scheduled ingestion completed. Successful: {}, Failed: {}", 
                    successful, failed);
                    
        } catch (Exception e) {
            log.error("Scheduled ingestion failed: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Health check - log worker status
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void logWorkerStatus() {
        log.debug("Ingestion worker is active. Monitoring {} subreddits", subreddits.size());
    }
}
