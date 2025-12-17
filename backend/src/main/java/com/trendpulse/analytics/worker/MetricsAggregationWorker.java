package com.trendpulse.analytics.worker;

import com.trendpulse.analytics.service.MaterializedViewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled worker for metrics aggregation
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MetricsAggregationWorker {
    
    private final MaterializedViewService materializedViewService;
    
    /**
     * Aggregate metrics and refresh views
     * Runs every hour
     */
    @Scheduled(cron = "0 0 * * * *")
    public void aggregateMetrics() {
        log.info("Starting metrics aggregation");
        
        try {
            // Refresh materialized views
            materializedViewService.refreshDashboardOverview();
            
            log.info("Metrics aggregation completed successfully");
            
        } catch (Exception e) {
            log.error("Metrics aggregation failed: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Health check - log worker status
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void logWorkerStatus() {
        log.debug("Metrics aggregation worker is active");
    }
}
