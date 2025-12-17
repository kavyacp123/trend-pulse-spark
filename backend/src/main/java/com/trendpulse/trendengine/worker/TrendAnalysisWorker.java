package com.trendpulse.trendengine.worker;

import com.trendpulse.ingestion.model.IngestionLog;
import com.trendpulse.ingestion.repository.IngestionLogRepository;
import com.trendpulse.trendengine.service.TrendDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Scheduled worker for trend analysis
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TrendAnalysisWorker {
    
    private final TrendDetectionService trendDetectionService;
    private final IngestionLogRepository ingestionLogRepository;
    
    /**
     * Analyze trends from recent ingestions
     * Runs based on cron expression in application.yml
     */
    @Scheduled(cron = "${app.trend.analysis.schedule.cron}")
    public void runTrendAnalysis() {
        log.info("Starting scheduled trend analysis");
        
        try {
            // Get completed ingestions from last hour
            Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
            List<IngestionLog> recentIngestions = ingestionLogRepository
                    .findByStartedAtAfterOrderByStartedAtDesc(oneHourAgo);
            
            int analyzedCount = 0;
            int trendCount = 0;
            
            for (IngestionLog ingestion : recentIngestions) {
                if (!"completed".equals(ingestion.getStatus())) {
                    continue;
                }
                
                try {
                    var trends = trendDetectionService.analyzeTrends(
                            ingestion.getStoragePath(),
                            ingestion.getSubreddit()
                    );
                    
                    analyzedCount++;
                    trendCount += trends.size();
                    
                } catch (Exception e) {
                    log.error("Failed to analyze ingestion {}: {}", 
                            ingestion.getId(), e.getMessage());
                }
            }
            
            log.info("Trend analysis completed. Analyzed {} ingestions, detected {} trends",
                    analyzedCount, trendCount);
                    
        } catch (Exception e) {
            log.error("Scheduled trend analysis failed: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Health check - log worker status
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void logWorkerStatus() {
        long activeTrends = trendDetectionService.getTopTrends(1000).size();
        log.debug("Trend analysis worker is active. Active trends: {}", activeTrends);
    }
}
