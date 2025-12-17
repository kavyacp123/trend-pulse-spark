package com.trendpulse.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Topic distribution response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicDistributionResponse {
    
    private String topic;
    private Integer frequency;
    private Double percentage;
    private Double avgScore;
    private String subreddit;
}
