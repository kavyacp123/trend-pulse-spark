package com.trendpulse.trendengine.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Trend entity representing a detected trending topic
 */
@Entity
@Table(name = "trends", indexes = {
    @Index(name = "idx_trends_topic", columnList = "topic"),
    @Index(name = "idx_trends_subreddit", columnList = "subreddit"),
    @Index(name = "idx_trends_score", columnList = "trend_score"),
    @Index(name = "idx_trends_detected_at", columnList = "detected_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trend {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String topic;
    
    @Column(nullable = false)
    private String subreddit;
    
    @Column(name = "trend_score", nullable = false)
    @Builder.Default
    private Double trendScore = 0.0;
    
    @Column(nullable = false)
    @Builder.Default
    private Double velocity = 0.0;
    
    @Column(name = "engagement_rate", nullable = false)
    @Builder.Default
    private Double engagementRate = 0.0;
    
    @Column(name = "post_count", nullable = false)
    @Builder.Default
    private Integer postCount = 0;
    
    @Column(name = "comment_count", nullable = false)
    @Builder.Default
    private Integer commentCount = 0;
    
    @Column(name = "upvote_count", nullable = false)
    @Builder.Default
    private Integer upvoteCount = 0;
    
    @Column(name = "raw_data_path", columnDefinition = "TEXT")
    private String rawDataPath;
    
    @Column(name = "detected_at", nullable = false)
    private Instant detectedAt;
    
    @Column(name = "first_seen_at", nullable = false)
    private Instant firstSeenAt;
    
    @Column(name = "last_updated_at", nullable = false)
    private Instant lastUpdatedAt;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "active";
    
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (detectedAt == null) detectedAt = now;
        if (firstSeenAt == null) firstSeenAt = now;
        if (lastUpdatedAt == null) lastUpdatedAt = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdatedAt = Instant.now();
    }
}
