package com.trendpulse.redditposting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Reddit post submission request DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSubmissionRequest {
    
    private Long generatedPostId;
    private String title;
    private String content;
    private String subreddit;
    private Boolean isDraft;
}
