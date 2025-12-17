package com.trendpulse.ai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * AI analysis result entity
 */
@Entity
@Table(name = "ai_analysis", indexes = {
    @Index(name = "idx_ai_analysis_trend_id", columnList = "trend_id"),
    @Index(name = "idx_ai_analysis_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "trend_id", nullable = false)
    private Long trendId;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    @Column(length = 50)
    private String sentiment;
    
    @Column(name = "key_insights", columnDefinition = "TEXT")
    private String keyInsights;
    
    @Column(name = "content_suggestions", columnDefinition = "TEXT")
    private String contentSuggestions;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "model_used", length = 100)
    private String modelUsed;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
