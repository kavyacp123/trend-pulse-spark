package com.trendpulse.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Trend metric entity for time-series data
 */
@Entity
@Table(name = "trend_metrics", indexes = {
    @Index(name = "idx_trend_metrics_trend_id", columnList = "trend_id"),
    @Index(name = "idx_trend_metrics_recorded_at", columnList = "recorded_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendMetric {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "trend_id", nullable = false)
    private Long trendId;
    
    @Column(nullable = false)
    private Double score;
    
    @Column(nullable = false)
    private Double velocity;
    
    @Column(name = "engagement_rate", nullable = false)
    private Double engagementRate;
    
    @Column(name = "post_count", nullable = false)
    private Integer postCount;
    
    @Column(name = "comment_count", nullable = false)
    private Integer commentCount;
    
    @Column(name = "upvote_count", nullable = false)
    private Integer upvoteCount;
    
    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;
    
    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) {
            recordedAt = Instant.now();
        }
    }
}
