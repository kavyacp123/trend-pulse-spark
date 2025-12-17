package com.trendpulse.analytics.controller;

import com.trendpulse.analytics.dto.*;
import com.trendpulse.analytics.service.*;
import com.trendpulse.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for analytics endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    
    private final DashboardService dashboardService;
    private final TimeSeriesService timeSeriesService;
    private final EngagementService engagementService;
    private final TopicDistributionService topicDistributionService;
    private final MaterializedViewService materializedViewService;
    
    /**
     * Get dashboard overview
     */
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DashboardOverviewResponse>> getOverview() {
        log.info("Dashboard overview requested");
        
        DashboardOverviewResponse overview = dashboardService.getOverview();
        
        return ResponseEntity.ok(ApiResponse.success(
                "Dashboard overview retrieved",
                overview
        ));
    }
    
    /**
     * Get time-series data for a trend
     */
    @GetMapping("/trends/timeseries")
    public ResponseEntity<ApiResponse<TimeSeriesResponse>> getTimeSeries(
            @RequestParam Long trendId,
            @RequestParam(defaultValue = "day") String period) {
        
        log.info("Time-series data requested for trend: {}, period: {}", trendId, period);
        
        TimeSeriesResponse timeSeries = timeSeriesService.getTimeSeriesData(trendId, period);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Time-series data retrieved",
                timeSeries
        ));
    }
    
    /**
     * Get engagement metrics
     */
    @GetMapping("/engagement")
    public ResponseEntity<ApiResponse<EngagementMetrics>> getEngagement(
            @RequestParam String subreddit,
            @RequestParam(defaultValue = "7") int days) {
        
        log.info("Engagement metrics requested for r/{}, days: {}", subreddit, days);
        
        EngagementMetrics metrics = engagementService.getEngagementMetrics(subreddit, days);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Engagement metrics retrieved",
                metrics
        ));
    }
    
    /**
     * Get topic distribution
     */
    @GetMapping("/topics/distribution")
    public ResponseEntity<ApiResponse<List<TopicDistributionResponse>>> getTopicDistribution(
            @RequestParam String subreddit,
            @RequestParam(defaultValue = "10") int limit) {
        
        log.info("Topic distribution requested for r/{}, limit: {}", subreddit, limit);
        
        List<TopicDistributionResponse> distribution = 
                topicDistributionService.getTopicDistribution(subreddit, limit);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Topic distribution retrieved",
                distribution
        ));
    }
    
    /**
     * Manually refresh materialized views (admin)
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refreshViews() {
        log.info("Manual materialized view refresh requested");
        
        materializedViewService.refreshDashboardOverview();
        
        return ResponseEntity.ok(ApiResponse.success(
                "Materialized views refreshed",
                "Dashboard overview updated"
        ));
    }
    
    /**
     * Clear analytics caches (admin)
     */
    @PostMapping("/cache/clear")
    public ResponseEntity<ApiResponse<String>> clearCaches() {
        log.info("Cache clear requested");
        
        materializedViewService.clearAnalyticsCaches();
        
        return ResponseEntity.ok(ApiResponse.success(
                "Caches cleared",
                "All analytics caches have been cleared"
        ));
    }
}
