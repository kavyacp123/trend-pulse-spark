package com.trendpulse.analytics.service;

import com.trendpulse.analytics.dto.EngagementMetrics;
import com.trendpulse.analytics.repository.DailyTrendMetricRepository;
import com.trendpulse.trendengine.model.Trend;
import com.trendpulse.trendengine.repository.TrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for engagement analytics
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EngagementService {
    
    private final TrendRepository trendRepository;
    private final DailyTrendMetricRepository dailyMetricRepository;
    
    /**
     * Get engagement metrics for a subreddit
     */
    @Cacheable(value = "analytics:engagement", key = "#subreddit + ':' + #days", unless = "#result == null")
    public EngagementMetrics getEngagementMetrics(String subreddit, int days) {
        log.info("Calculating engagement metrics for r/{} over {} days", subreddit, days);
        
        List<Trend> trends = trendRepository.findBySubredditOrderByTrendScoreDesc(subreddit);
        
        if (trends.isEmpty()) {
            return EngagementMetrics.builder()
                    .subreddit(subreddit)
                    .period(days + " days")
                    .build();
        }
        
        int totalPosts = trends.stream()
                .mapToInt(t -> t.getPostCount() != null ? t.getPostCount() : 0)
                .sum();
        
        int totalComments = trends.stream()
                .mapToInt(t -> t.getCommentCount() != null ? t.getCommentCount() : 0)
                .sum();
        
        int totalUpvotes = trends.stream()
                .mapToInt(t -> t.getUpvoteCount() != null ? t.getUpvoteCount() : 0)
                .sum();
        
        double avgEngagementRate = trends.stream()
                .mapToDouble(t -> t.getEngagementRate() != null ? t.getEngagementRate() : 0)
                .average()
                .orElse(0.0);
        
        List<String> trendingTopics = trends.stream()
                .sorted((a, b) -> Double.compare(
                        b.getTrendScore() != null ? b.getTrendScore() : 0,
                        a.getTrendScore() != null ? a.getTrendScore() : 0))
                .limit(10)
                .map(Trend::getTopic)
                .collect(Collectors.toList());
        
        return EngagementMetrics.builder()
                .subreddit(subreddit)
                .period(days + " days")
                .avgEngagementRate(avgEngagementRate)
                .totalPosts(totalPosts)
                .totalComments(totalComments)
                .totalUpvotes(totalUpvotes)
                .peakHour(14) // Placeholder - would need hourly analysis
                .trendingTopics(trendingTopics)
                .commentToPostRatio(totalPosts > 0 ? (double) totalComments / totalPosts : 0)
                .upvoteToPostRatio(totalPosts > 0 ? (double) totalUpvotes / totalPosts : 0)
                .build();
    }
}
