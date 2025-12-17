package com.trendpulse.ingestion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Ingestion log entity for tracking data fetches
 */
@Entity
@Table(name = "ingestion_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngestionLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @Builder.Default
    private String source = "reddit";
    
    private String subreddit;
    
    @Column(name = "posts_fetched", nullable = false)
    @Builder.Default
    private Integer postsFetched = 0;
    
    @Column(name = "storage_path", columnDefinition = "TEXT")
    private String storagePath;
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "pending";
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "started_at", nullable = false)
    private Instant startedAt;
    
    @Column(name = "completed_at")
    private Instant completedAt;
    
    @PrePersist
    protected void onCreate() {
        if (startedAt == null) {
            startedAt = Instant.now();
        }
    }
    
    /**
     * Mark ingestion as completed
     */
    public void markCompleted(int postsFetched, String storagePath) {
        this.postsFetched = postsFetched;
        this.storagePath = storagePath;
        this.status = "completed";
        this.completedAt = Instant.now();
    }
    
    /**
     * Mark ingestion as failed
     */
    public void markFailed(String errorMessage) {
        this.status = "failed";
        this.errorMessage = errorMessage;
        this.completedAt = Instant.now();
    }
}
