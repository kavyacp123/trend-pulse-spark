package com.trendpulse.trendengine.service;

import com.trendpulse.ingestion.model.RedditPost;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for computing trend metrics
 */
@Slf4j
@Service
public class MetricsComputationService {
    
    @Value("${app.trend.detection.velocity-weight}")
    private double velocityWeight;
    
    @Value("${app.trend.detection.engagement-weight}")
    private double engagementWeight;
    
    /**
     * Calculate trend score based on velocity and engagement
     */
    public double calculateTrendScore(double velocity, double engagementRate) {
        return (velocity * velocityWeight) + (engagementRate * engagementWeight);
    }
    
    /**
     * Calculate velocity (posts per hour)
     */
    public double calculateVelocity(List<RedditPost> posts) {
        if (posts.isEmpty()) {
            return 0.0;
        }
        
        Instant now = Instant.now();
        Instant oldest = posts.stream()
                .map(RedditPost::getCreatedUtc)
                .min(Instant::compareTo)
                .orElse(now);
        
        long hoursDiff = Duration.between(oldest, now).toHours();
        if (hoursDiff == 0) hoursDiff = 1; // Avoid division by zero
        
        return (double) posts.size() / hoursDiff;
    }
    
    /**
     * Calculate engagement rate (comments + upvotes per post)
     */
    public double calculateEngagementRate(List<RedditPost> posts) {
        if (posts.isEmpty()) {
            return 0.0;
        }
        
        double totalEngagement = posts.stream()
                .mapToDouble(RedditPost::calculateEngagement)
                .sum();
        
        return totalEngagement / posts.size();
    }
    
    /**
     * Extract trending topics from posts using keyword frequency
     */
    public Map<String, List<RedditPost>> extractTrendingTopics(List<RedditPost> posts, int minPosts) {
        // Simple keyword extraction from titles
        Map<String, List<RedditPost>> topicPosts = new HashMap<>();
        
        for (RedditPost post : posts) {
            String title = post.getTitle();
            if (title == null) continue;
            
            // Extract significant words (simple approach)
            String[] words = title.toLowerCase()
                    .replaceAll("[^a-z0-9\\s]", "")
                    .split("\\s+");
            
            for (String word : words) {
                if (isSignificantWord(word)) {
                    topicPosts.computeIfAbsent(word, k -> new ArrayList<>()).add(post);
                }
            }
        }
        
        // Filter topics with minimum post count
        return topicPosts.entrySet().stream()
                .filter(entry -> entry.getValue().size() >= minPosts)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
    
    /**
     * Check if word is significant (not a stop word)
     */
    private boolean isSignificantWord(String word) {
        if (word.length() < 4) return false;
        
        Set<String> stopWords = Set.of(
            "this", "that", "with", "from", "have", "been", "were", "will",
            "would", "could", "should", "about", "their", "there", "these",
            "those", "what", "when", "where", "which", "while", "after"
        );
        
        return !stopWords.contains(word);
    }
    
    /**
     * Calculate total metrics for a group of posts
     */
    public TrendMetrics calculateMetrics(List<RedditPost> posts) {
        int totalPosts = posts.size();
        int totalComments = posts.stream()
                .mapToInt(p -> p.getNumComments() != null ? p.getNumComments() : 0)
                .sum();
        int totalUpvotes = posts.stream()
                .mapToInt(p -> p.getScore() != null ? p.getScore() : 0)
                .sum();
        
        double velocity = calculateVelocity(posts);
        double engagementRate = calculateEngagementRate(posts);
        double trendScore = calculateTrendScore(velocity, engagementRate);
        
        return TrendMetrics.builder()
                .postCount(totalPosts)
                .commentCount(totalComments)
                .upvoteCount(totalUpvotes)
                .velocity(velocity)
                .engagementRate(engagementRate)
                .trendScore(trendScore)
                .build();
    }
    
    /**
     * Trend metrics data class
     */
    @lombok.Data
    @lombok.Builder
    public static class TrendMetrics {
        private Integer postCount;
        private Integer commentCount;
        private Integer upvoteCount;
        private Double velocity;
        private Double engagementRate;
        private Double trendScore;
    }
}
