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
public class TrendData {
    private List<SocialMediaPost> posts;
    private List<Trend> trends;
    private String platform;
    private Instant collectedAt;
    private Integer totalPosts;
}
