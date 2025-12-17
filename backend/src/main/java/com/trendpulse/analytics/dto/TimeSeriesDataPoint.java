package com.trendpulse.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Time-series data point DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesDataPoint {
    
    private Instant timestamp;
    private Double score;
    private Double velocity;
    private Integer postCount;
    private Integer commentCount;
    private Integer upvoteCount;
    private Double engagementRate;
}
