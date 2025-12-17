package com.trendpulse.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI analysis response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {
    
    private String summary;
    private String sentiment;
    private String keyInsights;
    private String contentSuggestions;
    private Double confidenceScore;
}
