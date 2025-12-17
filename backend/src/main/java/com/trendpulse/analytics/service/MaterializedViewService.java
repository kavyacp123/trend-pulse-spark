package com.trendpulse.analytics.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Service for managing materialized views
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MaterializedViewService {
    
    private final JdbcTemplate jdbcTemplate;
    private final CacheManager cacheManager;
    
    /**
     * Refresh dashboard overview materialized view
     */
    public void refreshDashboardOverview() {
        log.info("Refreshing dashboard_overview materialized view");
        
        try {
            jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_overview");
            
            // Clear related caches
            clearAnalyticsCaches();
            
            log.info("Dashboard overview refreshed successfully");
        } catch (Exception e) {
            log.error("Failed to refresh dashboard overview", e);
        }
    }
    
    /**
     * Clear all analytics caches
     */
    public void clearAnalyticsCaches() {
        log.info("Clearing analytics caches");
        
        String[] cacheNames = {
            "analytics:overview",
            "analytics:timeseries",
            "analytics:engagement",
            "analytics:topics"
        };
        
        for (String cacheName : cacheNames) {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
                log.debug("Cleared cache: {}", cacheName);
            }
        }
    }
    
    /**
     * Get last refresh time (placeholder)
     */
    public Instant getLastRefreshTime() {
        // This would query a metadata table in production
        return Instant.now();
    }
}
