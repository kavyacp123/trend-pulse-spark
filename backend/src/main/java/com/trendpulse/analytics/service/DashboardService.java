package com.trendpulse.analytics.service;

import com.trendpulse.analytics.dto.DashboardOverviewResponse;
import com.trendpulse.analytics.repository.TopicDistributionRepository;
import com.trendpulse.trendengine.model.Trend;
import com.trendpulse.trendengine.repository.TrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for dashboard overview data
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final TrendRepository trendRepository;
    private final TopicDistributionRepository topicDistributionRepository;
    
    /**
     * Get dashboard overview with caching
     */
    @Cacheable(value = "analytics:overview", unless = "#result == null")
    public DashboardOverviewResponse getOverview() {
        log.info("Generating dashboard overview");
        
        // Get all trends
        List<Trend> allTrends = trendRepository.findAll();
        
        // Calculate totals
        long totalTrends = allTrends.size();
        long activeTrends = allTrends.stream()
                .filter(t -> "active".equals(t.getStatus()))
                .count();
        
        long totalPosts = allTrends.stream()
                .mapToLong(t -> t.getPostCount() != null ? t.getPostCount() : 0)
                .sum();
        
        long totalEngagement = allTrends.stream()
                .mapToLong(t -> (t.getUpvoteCount() != null ? t.getUpvoteCount() : 0) +
                               (t.getCommentCount() != null ? t.getCommentCount() : 0))
                .sum();
        
        // Get top subreddits
        Map<String, List<Trend>> trendsBySubreddit = allTrends.stream()
                .collect(Collectors.groupingBy(Trend::getSubreddit));
        
        List<DashboardOverviewResponse.SubredditStats> topSubreddits = trendsBySubreddit.entrySet().stream()
                .map(entry -> DashboardOverviewResponse.SubredditStats.builder()
                        .name(entry.getKey())
                        .trendCount((long) entry.getValue().size())
                        .avgScore(entry.getValue().stream()
                                .mapToDouble(t -> t.getTrendScore() != null ? t.getTrendScore() : 0)
                                .average()
                                .orElse(0.0))
                        .build())
                .sorted((a, b) -> Long.compare(b.getTrendCount(), a.getTrendCount()))
                .limit(5)
                .collect(Collectors.toList());
        
        // Get recent trends (last 24 hours)
        Instant yesterday = Instant.now().minus(24, ChronoUnit.HOURS);
        List<DashboardOverviewResponse.TrendSummary> recentTrends = trendRepository
                .findRecentTrends(yesterday).stream()
                .limit(10)
                .map(trend -> DashboardOverviewResponse.TrendSummary.builder()
                        .id(trend.getId())
                        .topic(trend.getTopic())
                        .subreddit(trend.getSubreddit())
                        .trendScore(trend.getTrendScore())
                        .velocity(trend.getVelocity())
                        .postCount(trend.getPostCount())
                        .detectedAt(trend.getDetectedAt())
                        .build())
                .collect(Collectors.toList());
        
        return DashboardOverviewResponse.builder()
                .totalTrends(totalTrends)
                .activeTrends(activeTrends)
                .totalPosts(totalPosts)
                .totalEngagement(totalEngagement)
                .topSubreddits(topSubreddits)
                .recentTrends(recentTrends)
                .lastUpdated(Instant.now())
                .build();
    }
}
