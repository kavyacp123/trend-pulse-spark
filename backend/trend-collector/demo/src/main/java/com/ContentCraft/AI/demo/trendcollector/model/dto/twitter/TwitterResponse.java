package com.ContentCraft.AI.demo.trendcollector.model.dto.twitter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TwitterResponse {
    private List<TwitterTweet> data;
    private TwitterMeta meta;
}