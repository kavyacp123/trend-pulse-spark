package com.trendpulse.redditposting.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Reddit post submission tracking entity
 */
@Entity
@Table(name = "post_submissions", indexes = {
    @Index(name = "idx_submissions_post_id", columnList = "generated_post_id"),
    @Index(name = "idx_submissions_status", columnList = "status"),
    @Index(name = "idx_submissions_submitted_at", columnList = "submitted_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "generated_post_id", nullable = false)
    private Long generatedPostId;
    
    @Column(name = "reddit_post_id", length = 100)
    private String redditPostId;
    
    @Column(name = "reddit_url", length = 500)
    private String redditUrl;
    
    @Column(nullable = false)
    private String subreddit;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "pending";
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "submitted_at")
    private Instant submittedAt;
    
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
