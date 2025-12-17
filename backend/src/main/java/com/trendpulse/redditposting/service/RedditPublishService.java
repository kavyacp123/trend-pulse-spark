package com.trendpulse.redditposting.service;

import com.trendpulse.postgenerator.model.GeneratedPost;
import com.trendpulse.postgenerator.repository.GeneratedPostRepository;
import com.trendpulse.redditposting.client.RedditPostingClient;
import com.trendpulse.redditposting.dto.PostSubmissionRequest;
import com.trendpulse.redditposting.model.PostSubmission;
import com.trendpulse.redditposting.repository.PostSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Service for publishing posts to Reddit
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedditPublishService {
    
    private final RedditPostingClient redditPostingClient;
    private final PostSubmissionRepository submissionRepository;
    private final GeneratedPostRepository generatedPostRepository;
    
    /**
     * Submit a generated post to Reddit
     */
    @Transactional
    public PostSubmission submitPost(PostSubmissionRequest request, Long userId) {
        log.info("Submitting post to Reddit: {}", request.getTitle());
        
        // Get generated post
        GeneratedPost generatedPost = generatedPostRepository.findById(request.getGeneratedPostId())
                .orElseThrow(() -> new RuntimeException("Generated post not found"));
        
        // Create submission record
        PostSubmission submission = PostSubmission.builder()
                .generatedPostId(generatedPost.getId())
                .subreddit(request.getSubreddit())
                .status("pending")
                .build();
        
        submission = submissionRepository.save(submission);
        
        try {
            // Submit to Reddit
            Map<String, String> result = redditPostingClient.submitPost(
                    request.getSubreddit(),
                    request.getTitle(),
                    request.getContent(),
                    userId
            );
            
            // Update submission based on result
            if ("success".equals(result.get("status"))) {
                submission.setStatus("posted");
                submission.setRedditPostId(result.get("postId"));
                submission.setRedditUrl(result.get("url"));
                submission.setSubmittedAt(Instant.now());
                
                // Update generated post status
                generatedPost.setStatus("posted");
                generatedPostRepository.save(generatedPost);
                
                log.info("Post submitted successfully: {}", result.get("url"));
            } else {
                submission.setStatus("failed");
                submission.setErrorMessage(result.get("error"));
                
                log.error("Post submission failed: {}", result.get("error"));
            }
            
        } catch (Exception e) {
            submission.setStatus("failed");
            submission.setErrorMessage(e.getMessage());
            
            log.error("Post submission exception: {}", e.getMessage(), e);
        }
        
        return submissionRepository.save(submission);
    }
    
    /**
     * Get submission by ID
     */
    public PostSubmission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }
    
    /**
     * Get submissions by status
     */
    public List<PostSubmission> getSubmissionsByStatus(String status) {
        return submissionRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    /**
     * Get recent submissions
     */
    public List<PostSubmission> getRecentSubmissions(Instant since) {
        return submissionRepository.findBySubmittedAtAfterOrderBySubmittedAtDesc(since);
    }
}
