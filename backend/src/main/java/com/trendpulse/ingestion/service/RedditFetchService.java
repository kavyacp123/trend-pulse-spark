package com.trendpulse.ingestion.service;

import com.trendpulse.auth.model.User;
import com.trendpulse.auth.repository.UserRepository;
import com.trendpulse.common.exception.ServiceException;
import com.trendpulse.ingestion.client.RedditApiClient;
import com.trendpulse.ingestion.model.IngestionLog;
import com.trendpulse.ingestion.model.RedditPost;
import com.trendpulse.ingestion.repository.IngestionLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for fetching Reddit data
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedditFetchService {
    
    private final RedditApiClient redditApiClient;
    private final ObjectStorageService objectStorageService;
    private final IngestionLogRepository ingestionLogRepository;
    private final UserRepository userRepository;
    
    @Value("${app.ingestion.posts-per-fetch}")
    private int postsPerFetch;
    
    /**
     * Fetch posts from a subreddit
     */
    @Transactional
    public IngestionLog fetchFromSubreddit(String subreddit) {
        // Get first active user with Reddit OAuth (for API access)
        User user = userRepository.findAll().stream()
                .filter(User::getIsActive)
                .findFirst()
                .orElseThrow(() -> new ServiceException("No active user found for Reddit API access"));
        
        // Create ingestion log
        IngestionLog log = IngestionLog.builder()
                .source("reddit")
                .subreddit(subreddit)
                .status("running")
                .build();
        log = ingestionLogRepository.save(log);
        
        try {
            // Fetch posts from Reddit
            List<RedditPost> posts = redditApiClient.fetchHotPosts(user, subreddit, postsPerFetch);
            
            if (posts.isEmpty()) {
                log.markFailed("No posts fetched from subreddit");
                ingestionLogRepository.save(log);
                return log;
            }
            
            // Store in MinIO
            String storagePath = objectStorageService.storeRedditPosts(subreddit, posts);
            
            // Update log
            log.markCompleted(posts.size(), storagePath);
            ingestionLogRepository.save(log);
            
            this.log.info("Successfully fetched {} posts from r/{}", posts.size(), subreddit);
            
            return log;
            
        } catch (Exception e) {
            this.log.error("Failed to fetch from r/{}: {}", subreddit, e.getMessage(), e);
            log.markFailed(e.getMessage());
            ingestionLogRepository.save(log);
            throw new ServiceException("Failed to fetch Reddit data", e);
        }
    }
    
    /**
     * Fetch posts from multiple subreddits
     */
    @Transactional
    public List<IngestionLog> fetchFromSubreddits(List<String> subreddits) {
        List<IngestionLog> logs = new ArrayList<>();
        
        for (String subreddit : subreddits) {
            try {
                IngestionLog log = fetchFromSubreddit(subreddit);
                logs.add(log);
            } catch (Exception e) {
                log.error("Failed to fetch from r/{}, continuing with others", subreddit);
            }
        }
        
        return logs;
    }
    
    /**
     * Get ingestion history
     */
    public List<IngestionLog> getIngestionHistory(int limit) {
        return ingestionLogRepository.findAll().stream()
                .sorted((a, b) -> b.getStartedAt().compareTo(a.getStartedAt()))
                .limit(limit)
                .toList();
    }
}
