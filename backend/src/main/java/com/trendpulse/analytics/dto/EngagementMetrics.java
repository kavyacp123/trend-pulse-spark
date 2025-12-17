package com.trendpulse.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Engagement metrics response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngagementMetrics {
    
    private String subreddit;
    private String period;
    private Double avgEngagementRate;
    private Integer totalPosts;
    private Integer totalComments;
    private Integer totalUpvotes;
    private Integer peakHour;
    private List<String> trendingTopics;
    private Double commentToPostRatio;
    private Double upvoteToPostRatio;
}
