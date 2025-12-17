package com.trendpulse.redditposting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Reddit post submission response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSubmissionResponse {
    
    private Long id;
    private Long generatedPostId;
    private String redditPostId;
    private String redditUrl;
    private String subreddit;
    private String status;
    private String errorMessage;
    private Instant submittedAt;
}
