package com.trendpulse.redditposting.controller;

import com.trendpulse.common.dto.ApiResponse;
import com.trendpulse.redditposting.dto.PostSubmissionRequest;
import com.trendpulse.redditposting.dto.PostSubmissionResponse;
import com.trendpulse.redditposting.model.PostSubmission;
import com.trendpulse.redditposting.service.RedditPublishService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for Reddit posting endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostingController {
    
    private final RedditPublishService redditPublishService;
    
    /**
     * Submit a post to Reddit
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<PostSubmissionResponse>> submitPost(
            @RequestBody PostSubmissionRequest request,
            Authentication authentication) {
        
        log.info("Post submission requested: {}", request.getTitle());
        
        // Get user ID from authentication
        Long userId = 1L; // TODO: Extract from authentication
        
        PostSubmission submission = redditPublishService.submitPost(request, userId);
        
        PostSubmissionResponse response = mapToResponse(submission);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Post submission processed",
                response
        ));
    }
    
    /**
     * Get submission status by ID
     */
    @GetMapping("/status/{id}")
    public ResponseEntity<ApiResponse<PostSubmissionResponse>> getSubmissionStatus(@PathVariable Long id) {
        PostSubmission submission = redditPublishService.getSubmissionById(id);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Submission status retrieved",
                mapToResponse(submission)
        ));
    }
    
    /**
     * Get submissions by status
     */
    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<PostSubmissionResponse>>> getSubmissions(
            @RequestParam(defaultValue = "all") String status) {
        
        List<PostSubmission> submissions;
        
        if ("all".equals(status)) {
            Instant yesterday = Instant.now().minus(24, ChronoUnit.HOURS);
            submissions = redditPublishService.getRecentSubmissions(yesterday);
        } else {
            submissions = redditPublishService.getSubmissionsByStatus(status);
        }
        
        List<PostSubmissionResponse> responses = submissions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(
                "Submissions retrieved",
                responses
        ));
    }
    
    /**
     * Map PostSubmission to response DTO
     */
    private PostSubmissionResponse mapToResponse(PostSubmission submission) {
        return PostSubmissionResponse.builder()
                .id(submission.getId())
                .generatedPostId(submission.getGeneratedPostId())
                .redditPostId(submission.getRedditPostId())
                .redditUrl(submission.getRedditUrl())
                .subreddit(submission.getSubreddit())
                .status(submission.getStatus())
                .errorMessage(submission.getErrorMessage())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
