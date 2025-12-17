package com.trendpulse.trendengine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI analysis job payload for queue
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisJob {
    
    private Long trendId;
    private String topic;
    private String subreddit;
    private String rawDataPath;
    private Integer priority;
    private Double trendScore;
}
