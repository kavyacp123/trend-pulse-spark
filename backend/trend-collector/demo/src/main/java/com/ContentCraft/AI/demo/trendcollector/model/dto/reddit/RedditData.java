package com.ContentCraft.AI.demo.trendcollector.model.dto.reddit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RedditData {
    private List<RedditPost> children;
}