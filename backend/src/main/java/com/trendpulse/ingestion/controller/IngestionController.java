package com.trendpulse.ingestion.controller;

import com.trendpulse.common.dto.ApiResponse;
import com.trendpulse.ingestion.dto.IngestionStatusResponse;
import com.trendpulse.ingestion.model.IngestionLog;
import com.trendpulse.ingestion.service.RedditFetchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for manual ingestion triggers and status
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ingestion")
@RequiredArgsConstructor
public class IngestionController {
    
    private final RedditFetchService redditFetchService;
    
    /**
     * Manually trigger ingestion for a specific subreddit
     */
    @PostMapping("/trigger")
    public ResponseEntity<ApiResponse<IngestionStatusResponse>> triggerIngestion(
            @RequestParam String subreddit) {
        
        log.info("Manual ingestion triggered for r/{}", subreddit);
        
        IngestionLog ingestionLog = redditFetchService.fetchFromSubreddit(subreddit);
        
        IngestionStatusResponse response = mapToResponse(ingestionLog);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Ingestion completed for r/" + subreddit, 
                response
        ));
    }
    
    /**
     * Trigger ingestion for multiple subreddits
     */
    @PostMapping("/trigger/batch")
    public ResponseEntity<ApiResponse<List<IngestionStatusResponse>>> triggerBatchIngestion(
            @RequestBody List<String> subreddits) {
        
        log.info("Batch ingestion triggered for {} subreddits", subreddits.size());
        
        List<IngestionLog> logs = redditFetchService.fetchFromSubreddits(subreddits);
        
        List<IngestionStatusResponse> responses = logs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Batch ingestion completed", 
                responses
        ));
    }
    
    /**
     * Get ingestion status by ID
     */
    @GetMapping("/status/{id}")
    public ResponseEntity<ApiResponse<IngestionStatusResponse>> getStatus(@PathVariable Long id) {
        // This would fetch from repository
        return ResponseEntity.ok(ApiResponse.success("Status retrieved", null));
    }
    
    /**
     * Get ingestion history
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<IngestionStatusResponse>>> getHistory(
            @RequestParam(defaultValue = "20") int limit) {
        
        List<IngestionLog> logs = redditFetchService.getIngestionHistory(limit);
        
        List<IngestionStatusResponse> responses = logs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "History retrieved", 
                responses
        ));
    }
    
    /**
     * Map IngestionLog to response DTO
     */
    private IngestionStatusResponse mapToResponse(IngestionLog log) {
        Long durationMs = null;
        if (log.getCompletedAt() != null && log.getStartedAt() != null) {
            durationMs = Duration.between(log.getStartedAt(), log.getCompletedAt()).toMillis();
        }
        
        return IngestionStatusResponse.builder()
                .id(log.getId())
                .source(log.getSource())
                .subreddit(log.getSubreddit())
                .postsFetched(log.getPostsFetched())
                .status(log.getStatus())
                .storagePath(log.getStoragePath())
                .startedAt(log.getStartedAt())
                .completedAt(log.getCompletedAt())
                .durationMs(durationMs)
                .build();
    }
}
