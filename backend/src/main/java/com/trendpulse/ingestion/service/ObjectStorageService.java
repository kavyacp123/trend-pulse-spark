package com.trendpulse.ingestion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.common.exception.ServiceException;
import com.trendpulse.ingestion.model.RedditPost;
import com.trendpulse.storage.model.StorageMetadata;
import com.trendpulse.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service for storing Reddit data in object storage
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ObjectStorageService {
    
    private final StorageService storageService;
    private final ObjectMapper objectMapper;
    
    /**
     * Store Reddit posts in MinIO
     */
    public String storeRedditPosts(String subreddit, List<RedditPost> posts) {
        try {
            // Generate object key with timestamp
            String timestamp = DateTimeFormatter.ISO_INSTANT.format(Instant.now())
                    .replace(":", "-");
            String objectKey = String.format("reddit/%s/%s.json", subreddit, timestamp);
            
            // Convert posts to JSON
            String jsonData = objectMapper.writeValueAsString(posts);
            byte[] data = jsonData.getBytes();
            
            // Upload to MinIO
            InputStream inputStream = new ByteArrayInputStream(data);
            StorageMetadata metadata = storageService.upload(
                    AppConstants.BUCKET_RAW_DATA,
                    objectKey,
                    inputStream,
                    "application/json",
                    data.length
            );
            
            log.info("Stored {} posts from r/{} at: {}", posts.size(), subreddit, objectKey);
            
            return objectKey;
            
        } catch (Exception e) {
            log.error("Failed to store Reddit posts for r/{}", subreddit, e);
            throw new ServiceException("Failed to store Reddit data", e);
        }
    }
    
    /**
     * Retrieve Reddit posts from storage
     */
    public List<RedditPost> retrieveRedditPosts(String objectKey) {
        try {
            InputStream inputStream = storageService.download(
                    AppConstants.BUCKET_RAW_DATA,
                    objectKey
            );
            
            RedditPost[] posts = objectMapper.readValue(inputStream, RedditPost[].class);
            
            log.info("Retrieved {} posts from storage: {}", posts.length, objectKey);
            
            return List.of(posts);
            
        } catch (Exception e) {
            log.error("Failed to retrieve Reddit posts from: {}", objectKey, e);
            throw new ServiceException("Failed to retrieve Reddit data", e);
        }
    }
}
