package com.trendpulse.trendengine.service;

import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.queue.producer.QueueProducer;
import com.trendpulse.trendengine.dto.AIAnalysisJob;
import com.trendpulse.trendengine.model.Trend;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for publishing trends to AI analysis queue
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QueuePublishService {
    
    private final QueueProducer queueProducer;
    
    /**
     * Publish trend to AI analysis queue
     */
    public void publishForAIAnalysis(Trend trend) {
        AIAnalysisJob job = AIAnalysisJob.builder()
                .trendId(trend.getId())
                .topic(trend.getTopic())
                .subreddit(trend.getSubreddit())
                .rawDataPath(trend.getRawDataPath())
                .trendScore(trend.getTrendScore())
                .priority(calculatePriority(trend.getTrendScore()))
                .build();
        
        queueProducer.publishWithPriority(
                AppConstants.QUEUE_AI_ANALYSIS,
                job,
                job.getPriority()
        );
        
        log.info("Published trend {} to AI analysis queue with priority {}", 
                trend.getTopic(), job.getPriority());
    }
    
    /**
     * Calculate priority based on trend score
     * Higher score = higher priority (1-10 scale)
     */
    private int calculatePriority(double trendScore) {
        if (trendScore >= 1000) return 10;
        if (trendScore >= 500) return 8;
        if (trendScore >= 200) return 6;
        if (trendScore >= 100) return 4;
        return 2;
    }
}
