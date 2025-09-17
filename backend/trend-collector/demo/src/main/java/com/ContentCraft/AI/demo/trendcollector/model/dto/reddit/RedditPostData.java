package com.ContentCraft.AI.demo.trendcollector.model.dto.reddit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RedditPostData {
    private String id;
    private String title;
    private String selftext;
    private String author;
    private Long created;
    private Integer score;
    @JsonProperty("num_comments")
    private Integer numComments;
    private String url;
    private String subreddit;
}