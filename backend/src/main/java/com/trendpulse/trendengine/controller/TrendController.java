package com.trendpulse.trendengine.controller;

import com.trendpulse.common.dto.ApiResponse;
import com.trendpulse.trendengine.dto.TrendResponse;
import com.trendpulse.trendengine.model.Trend;
import com.trendpulse.trendengine.repository.TrendRepository;
import com.trendpulse.trendengine.service.TrendDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for trend endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/trends")
@RequiredArgsConstructor
public class TrendController {
    
    private final TrendDetectionService trendDetectionService;
    private final TrendRepository trendRepository;
    
    /**
     * Get all active trends
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TrendResponse>>> getAllTrends(
            @RequestParam(defaultValue = "50") int limit) {
        
        List<Trend> trends = trendDetectionService.getTopTrends(limit);
        
        List<TrendResponse> responses = trends.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Trends retrieved successfully",
                responses
        ));
    }
    
    /**
     * Get trend by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrendResponse>> getTrendById(@PathVariable Long id) {
        Trend trend = trendRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trend not found"));
        
        return ResponseEntity.ok(ApiResponse.success(
                "Trend retrieved",
                mapToResponse(trend)
        ));
    }
    
    /**
     * Get top trends
     */
    @GetMapping("/top")
    public ResponseEntity<ApiResponse<List<TrendResponse>>> getTopTrends(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Trend> trends = trendDetectionService.getTopTrends(limit);
        
        List<TrendResponse> responses = trends.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Top trends retrieved",
                responses
        ));
    }
    
    /**
     * Get trends by subreddit
     */
    @GetMapping("/subreddit/{subreddit}")
    public ResponseEntity<ApiResponse<List<TrendResponse>>> getTrendsBySubreddit(
            @PathVariable String subreddit) {
        
        List<Trend> trends = trendDetectionService.getTrendsBySubreddit(subreddit);
        
        List<TrendResponse> responses = trends.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Trends for r/" + subreddit + " retrieved",
                responses
        ));
    }
    
    /**
     * Search trends by topic
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TrendResponse>>> searchTrends(
            @RequestParam String q) {
        
        List<Trend> trends = trendRepository.findTopActiveTrends().stream()
                .filter(t -> t.getTopic().toLowerCase().contains(q.toLowerCase()))
                .limit(20)
                .toList();
        
        List<TrendResponse> responses = trends.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Search results for: " + q,
                responses
        ));
    }
    
    /**
     * Get recent trends (last 24 hours)
     */
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<TrendResponse>>> getRecentTrends() {
        Instant yesterday = Instant.now().minus(24, ChronoUnit.HOURS);
        
        List<Trend> trends = trendRepository.findRecentTrends(yesterday);
        
        List<TrendResponse> responses = trends.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Recent trends retrieved",
                responses
        ));
    }
    
    /**
     * Manually trigger trend analysis (admin)
     */
    @PostMapping("/recompute")
    public ResponseEntity<ApiResponse<String>> recomputeTrends(
            @RequestParam String storagePath,
            @RequestParam String subreddit) {
        
        log.info("Manual trend recompute triggered for: {}", storagePath);
        
        var trends = trendDetectionService.analyzeTrends(storagePath, subreddit);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Detected " + trends.size() + " trends",
                null
        ));
    }
    
    /**
     * Map Trend entity to response DTO
     */
    private TrendResponse mapToResponse(Trend trend) {
        return TrendResponse.builder()
                .id(trend.getId())
                .topic(trend.getTopic())
                .subreddit(trend.getSubreddit())
                .trendScore(trend.getTrendScore())
                .velocity(trend.getVelocity())
                .engagementRate(trend.getEngagementRate())
                .postCount(trend.getPostCount())
                .commentCount(trend.getCommentCount())
                .upvoteCount(trend.getUpvoteCount())
                .status(trend.getStatus())
                .detectedAt(trend.getDetectedAt())
                .firstSeenAt(trend.getFirstSeenAt())
                .build();
    }
}
