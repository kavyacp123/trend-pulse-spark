package com.ContentCraft.AI.demo.trendcollector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialMediaPost {
    private String id;
    private String platform; // "TWITTER", "REDDIT"
    private String content;
    private String author;
    private List<String> hashtags;
    private Instant timestamp;
    private Integer likes;
    private Integer shares;
    private Integer comments;
    private String url;
    private Double sentimentScore; // -1 to 1 (negative to positive)
}


