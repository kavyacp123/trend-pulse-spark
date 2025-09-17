package com.ContentCraft.AI.demo.trendcollector.model.dto.twitter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TwitterMetrics {
    @JsonProperty("retweet_count")
    private Integer retweetCount;
    @JsonProperty("like_count")
    private Integer likeCount;
    @JsonProperty("reply_count")
    private Integer replyCount;
}