package com.trendpulse.analytics.service;

import com.trendpulse.analytics.dto.TimeSeriesDataPoint;
import com.trendpulse.analytics.dto.TimeSeriesResponse;
import com.trendpulse.analytics.model.TrendMetric;
import com.trendpulse.analytics.repository.TrendMetricRepository;
import com.trendpulse.trendengine.model.Trend;
import com.trendpulse.trendengine.repository.TrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for time-series analytics
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TimeSeriesService {
    
    private final TrendMetricRepository trendMetricRepository;
    private final TrendRepository trendRepository;
    
    /**
     * Get time-series data for a trend
     */
    @Cacheable(value = "analytics:timeseries", key = "#trendId + ':' + #period", unless = "#result == null")
    public TimeSeriesResponse getTimeSeriesData(Long trendId, String period) {
        log.info("Fetching time-series data for trend: {}, period: {}", trendId, period);
        
        Trend trend = trendRepository.findById(trendId)
                .orElseThrow(() -> new RuntimeException("Trend not found"));
        
        Instant endTime = Instant.now();
        Instant startTime = calculateStartTime(endTime, period);
        
        List<TrendMetric> metrics = trendMetricRepository
                .findByTrendIdAndRecordedAtBetweenOrderByRecordedAtAsc(trendId, startTime, endTime);
        
        List<TimeSeriesDataPoint> dataPoints = metrics.stream()
                .map(metric -> TimeSeriesDataPoint.builder()
                        .timestamp(metric.getRecordedAt())
                        .score(metric.getScore())
                        .velocity(metric.getVelocity())
                        .postCount(metric.getPostCount())
                        .commentCount(metric.getCommentCount())
                        .upvoteCount(metric.getUpvoteCount())
                        .engagementRate(metric.getEngagementRate())
                        .build())
                .collect(Collectors.toList());
        
        return TimeSeriesResponse.builder()
                .trendId(trendId)
                .topic(trend.getTopic())
                .subreddit(trend.getSubreddit())
                .period(period)
                .dataPoints(dataPoints)
                .build();
    }
    
    private Instant calculateStartTime(Instant endTime, String period) {
        return switch (period.toLowerCase()) {
            case "hour" -> endTime.minus(1, ChronoUnit.HOURS);
            case "day" -> endTime.minus(1, ChronoUnit.DAYS);
            case "week" -> endTime.minus(7, ChronoUnit.DAYS);
            case "month" -> endTime.minus(30, ChronoUnit.DAYS);
            default -> endTime.minus(24, ChronoUnit.HOURS);
        };
    }
}
