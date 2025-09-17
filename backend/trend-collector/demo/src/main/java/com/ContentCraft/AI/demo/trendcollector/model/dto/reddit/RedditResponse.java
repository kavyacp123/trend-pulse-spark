package com.ContentCraft.AI.demo.trendcollector.model.dto.reddit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RedditResponse {
    private RedditData data;
}