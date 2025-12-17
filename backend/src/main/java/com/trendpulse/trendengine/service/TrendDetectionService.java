package com.trendpulse.trendengine.service;

import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.ingestion.model.RedditPost;
import com.trendpulse.ingestion.service.ObjectStorageService;
import com.trendpulse.trendengine.model.Trend;
import com.trendpulse.trendengine.repository.TrendRepository;
import com.trendpulse.trendengine.service.MetricsComputationService.TrendMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service for detecting trending topics from Reddit data
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TrendDetectionService {
    
    private final TrendRepository trendRepository;
    private final MetricsComputationService metricsService;
    private final ObjectStorageService objectStorageService;
    private final QueuePublishService queuePublishService;
    
    @Value("${app.trend.detection.min-score}")
    private double minTrendScore;
    
    /**
     * Analyze data from storage and detect trends
     */
    @Transactional
    public List<Trend> analyzeTrends(String storagePath, String subreddit) {
        log.info("Analyzing trends from: {}", storagePath);
        
        try {
            // Retrieve posts from storage
            List<RedditPost> posts = objectStorageService.retrieveRedditPosts(storagePath);
            
            if (posts.isEmpty()) {
                log.warn("No posts found in storage path: {}", storagePath);
                return List.of();
            }
            
            // Extract trending topics
            Map<String, List<RedditPost>> topicPosts = metricsService.extractTrendingTopics(posts, 3);
            
            List<Trend> detectedTrends = new ArrayList<>();
            
            for (Map.Entry<String, List<RedditPost>> entry : topicPosts.entrySet()) {
                String topic = entry.getKey();
                List<RedditPost> topicPostList = entry.getValue();
                
                // Calculate metrics
                TrendMetrics metrics = metricsService.calculateMetrics(topicPostList);
                
                // Only create trend if score meets minimum threshold
                if (metrics.getTrendScore() >= minTrendScore) {
                    Trend trend = createOrUpdateTrend(
                            topic,
                            subreddit,
                            storagePath,
                            metrics
                    );
                    
                    detectedTrends.add(trend);
                    
                    // Publish to AI analysis queue
                    queuePublishService.publishForAIAnalysis(trend);
                }
            }
            
            log.info("Detected {} trends from r/{}", detectedTrends.size(), subreddit);
            
            return detectedTrends;
            
        } catch (Exception e) {
            log.error("Failed to analyze trends from: {}", storagePath, e);
            return List.of();
        }
    }
    
    /**
     * Create new trend or update existing one
     */
    private Trend createOrUpdateTrend(String topic, String subreddit, 
                                     String rawDataPath, TrendMetrics metrics) {
        
        Trend trend = trendRepository.findByTopicAndSubreddit(topic, subreddit)
                .orElse(Trend.builder()
                        .topic(topic)
                        .subreddit(subreddit)
                        .build());
        
        // Update metrics
        trend.setTrendScore(metrics.getTrendScore());
        trend.setVelocity(metrics.getVelocity());
        trend.setEngagementRate(metrics.getEngagementRate());
        trend.setPostCount(metrics.getPostCount());
        trend.setCommentCount(metrics.getCommentCount());
        trend.setUpvoteCount(metrics.getUpvoteCount());
        trend.setRawDataPath(rawDataPath);
        trend.setStatus("active");
        
        trend = trendRepository.save(trend);
        
        log.info("Created/updated trend: {} in r/{} with score: {}", 
                topic, subreddit, metrics.getTrendScore());
        
        return trend;
    }
    
    /**
     * Get top trends
     */
    public List<Trend> getTopTrends(int limit) {
        return trendRepository.findTopActiveTrends().stream()
                .limit(limit)
                .toList();
    }
    
    /**
     * Get trends by subreddit
     */
    public List<Trend> getTrendsBySubreddit(String subreddit) {
        return trendRepository.findBySubredditOrderByTrendScoreDesc(subreddit);
    }
}
