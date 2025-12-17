package com.trendpulse.analytics.repository;

import com.trendpulse.analytics.model.DailyTrendMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for DailyTrendMetric entity
 */
@Repository
public interface DailyTrendMetricRepository extends JpaRepository<DailyTrendMetric, Long> {
    
    List<DailyTrendMetric> findByTrendIdAndMetricDateBetweenOrderByMetricDateAsc(
            Long trendId, LocalDate start, LocalDate end);
    
    List<DailyTrendMetric> findByTrendIdOrderByMetricDateDesc(Long trendId);
    
    @Query("SELECT dtm FROM DailyTrendMetric dtm WHERE dtm.metricDate >= :since ORDER BY dtm.metricDate DESC")
    List<DailyTrendMetric> findRecentDailyMetrics(LocalDate since);
    
    @Query("SELECT SUM(dtm.totalPosts) FROM DailyTrendMetric dtm WHERE dtm.metricDate >= :since")
    Long getTotalPostsSince(LocalDate since);
    
    @Query("SELECT SUM(dtm.totalComments + dtm.totalUpvotes) FROM DailyTrendMetric dtm WHERE dtm.metricDate >= :since")
    Long getTotalEngagementSince(LocalDate since);
}
