package com.trendpulse.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Time-series response wrapper
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesResponse {
    
    private Long trendId;
    private String topic;
    private String subreddit;
    private String period;
    private List<TimeSeriesDataPoint> dataPoints;
}
