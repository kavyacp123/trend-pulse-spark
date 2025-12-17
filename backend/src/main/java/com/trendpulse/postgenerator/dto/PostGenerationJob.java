package com.trendpulse.postgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Post generation job DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostGenerationJob {
    
    private Long trendId;
    private String topic;
    private String subreddit;
    private Long aiAnalysisId;
    private String summary;
    private String keyInsights;
    private String contentSuggestions;
}
