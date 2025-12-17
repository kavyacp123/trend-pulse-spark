package com.trendpulse.ingestion.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * Reddit post data model
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedditPost {
    
    private String id;
    private String title;
    private String selftext;
    private String author;
    private String subreddit;
    private String permalink;
    private String url;
    
    private Integer score;
    private Integer numComments;
    private Integer ups;
    private Integer downs;
    private Double upvoteRatio;
    
    private Instant createdUtc;
    private Boolean isVideo;
    private Boolean isSelf;
    private Boolean over18;
    private Boolean spoiler;
    
    private String thumbnail;
    private String domain;
    private List<String> flairText;
    
    /**
     * Calculate engagement score
     */
    public double calculateEngagement() {
        return (score != null ? score : 0) + 
               (numComments != null ? numComments * 2 : 0);
    }
}
