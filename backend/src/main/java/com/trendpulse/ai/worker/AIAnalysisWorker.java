package com.trendpulse.ai.worker;

import com.trendpulse.ai.service.AIAnalysisService;
import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.queue.consumer.RedisQueueConsumer;
import com.trendpulse.trendengine.dto.AIAnalysisJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Worker for processing AI analysis jobs from queue
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AIAnalysisWorker {
    
    private final RedisQueueConsumer queueConsumer;
    private final AIAnalysisService aiAnalysisService;
    
    /**
     * Process AI analysis jobs from queue
     * Runs every 30 seconds
     */
    @Scheduled(fixedDelay = 30000)
    public void processAnalysisJobs() {
        try {
            queueConsumer.consume(
                    AppConstants.QUEUE_AI_ANALYSIS,
                    message -> {
                        AIAnalysisJob job = (AIAnalysisJob) message.getPayload();
                        log.info("Processing AI analysis job for trend: {}", job.getTopic());
                        
                        aiAnalysisService.analyzeTrend(job);
                    },
                    AIAnalysisJob.class
            );
            
        } catch (Exception e) {
            log.error("Error processing AI analysis job: {}", e.getMessage());
        }
    }
    
    /**
     * Health check - log worker status
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void logWorkerStatus() {
        Long queueDepth = queueConsumer.getQueueDepth(AppConstants.QUEUE_AI_ANALYSIS);
        log.debug("AI analysis worker is active. Queue depth: {}", queueDepth);
    }
}
