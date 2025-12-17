package com.trendpulse.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Daily trend metric entity for aggregated data
 */
@Entity
@Table(name = "daily_trend_metrics", indexes = {
    @Index(name = "idx_daily_metrics_trend_id", columnList = "trend_id"),
    @Index(name = "idx_daily_metrics_date", columnList = "metric_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyTrendMetric {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "trend_id", nullable = false)
    private Long trendId;
    
    @Column(name = "metric_date", nullable = false)
    private LocalDate metricDate;
    
    @Column(name = "avg_score", nullable = false)
    private Double avgScore;
    
    @Column(name = "max_score", nullable = false)
    private Double maxScore;
    
    @Column(name = "avg_velocity", nullable = false)
    private Double avgVelocity;
    
    @Column(name = "total_posts", nullable = false)
    private Integer totalPosts;
    
    @Column(name = "total_comments", nullable = false)
    private Integer totalComments;
    
    @Column(name = "total_upvotes", nullable = false)
    private Integer totalUpvotes;
}
