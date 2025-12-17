package com.trendpulse.trendengine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Trend response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendResponse {
    
    private Long id;
    private String topic;
    private String subreddit;
    private Double trendScore;
    private Double velocity;
    private Double engagementRate;
    private Integer postCount;
    private Integer commentCount;
    private Integer upvoteCount;
    private String status;
    private Instant detectedAt;
    private Instant firstSeenAt;
}
