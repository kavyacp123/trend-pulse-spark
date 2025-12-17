package com.trendpulse.analytics.repository;

import com.trendpulse.analytics.model.TrendMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repository for TrendMetric entity
 */
@Repository
public interface TrendMetricRepository extends JpaRepository<TrendMetric, Long> {
    
    List<TrendMetric> findByTrendIdAndRecordedAtBetweenOrderByRecordedAtAsc(
            Long trendId, Instant start, Instant end);
    
    List<TrendMetric> findByTrendIdOrderByRecordedAtDesc(Long trendId);
    
    @Query("SELECT tm FROM TrendMetric tm WHERE tm.recordedAt >= :since ORDER BY tm.recordedAt DESC")
    List<TrendMetric> findRecentMetrics(Instant since);
    
    void deleteByTrendId(Long trendId);
}
