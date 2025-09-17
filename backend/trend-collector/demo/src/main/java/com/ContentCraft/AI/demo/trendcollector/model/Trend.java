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
public class Trend {
    private String hashtag;
    private String platform;
    private Integer frequency;
    private Double trendScore;
    private Instant firstSeen;
    private Instant lastUpdated;
    private List<String> relatedKeywords;
    private String category; // "TECHNOLOGY", "SPORTS", "POLITICS", etc.
}