package com.ContentCraft.AI.demo.trendcollector.model.dto.twitter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TwitterTweet {
    private String id;
    private String text;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("author_id")
    private String authorId;
    @JsonProperty("public_metrics")
    private TwitterMetrics publicMetrics;
}