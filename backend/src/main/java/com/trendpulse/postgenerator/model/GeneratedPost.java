package com.trendpulse.postgenerator.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Generated post entity
 */
@Entity
@Table(name = "generated_posts", indexes = {
    @Index(name = "idx_gen_posts_trend_id", columnList = "trend_id"),
    @Index(name = "idx_gen_posts_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneratedPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "trend_id", nullable = false)
    private Long trendId;
    
    @Column(name = "ai_analysis_id")
    private Long aiAnalysisId;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "target_subreddit", nullable = false)
    private String targetSubreddit;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "draft";
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
