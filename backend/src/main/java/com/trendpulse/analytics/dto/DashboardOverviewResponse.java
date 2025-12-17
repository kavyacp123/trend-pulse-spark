package com.trendpulse.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * Dashboard overview response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewResponse {
    
    private Long totalTrends;
    private Long activeTrends;
    private Long totalPosts;
    private Long totalEngagement;
    private List<SubredditStats> topSubreddits;
    private List<TrendSummary> recentTrends;
    private Instant lastUpdated;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubredditStats {
        private String name;
        private Long trendCount;
        private Double avgScore;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendSummary {
        private Long id;
        private String topic;
        private String subreddit;
        private Double trendScore;
        private Double velocity;
        private Integer postCount;
        private Instant detectedAt;
    }
}
