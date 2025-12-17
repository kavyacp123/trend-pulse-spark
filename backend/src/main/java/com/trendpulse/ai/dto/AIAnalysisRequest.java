package com.trendpulse.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI analysis request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisRequest {
    
    private Long trendId;
    private String topic;
    private String subreddit;
    private String rawDataPath;
    private Integer postCount;
    private Double trendScore;
}
