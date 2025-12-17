package com.trendpulse.postgenerator.worker;

import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.postgenerator.dto.PostGenerationJob;
import com.trendpulse.postgenerator.service.ContentGenerationService;
import com.trendpulse.queue.consumer.RedisQueueConsumer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Worker for processing post generation jobs
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PostGenerationWorker {
    
    private final RedisQueueConsumer queueConsumer;
    private final ContentGenerationService contentGenerationService;
    
    /**
     * Process post generation jobs from queue
     * Runs every 30 seconds
     */
    @Scheduled(fixedDelay = 30000)
    public void processPostGenerationJobs() {
        try {
            queueConsumer.consume(
                    AppConstants.QUEUE_POST_GENERATE,
                    message -> {
                        PostGenerationJob job = (PostGenerationJob) message.getPayload();
                        log.info("Processing post generation job for trend: {}", job.getTopic());
                        
                        contentGenerationService.generatePost(job);
                    },
                    PostGenerationJob.class
            );
            
        } catch (Exception e) {
            log.error("Error processing post generation job: {}", e.getMessage());
        }
    }
    
    /**
     * Health check - log worker status
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void logWorkerStatus() {
        Long queueDepth = queueConsumer.getQueueDepth(AppConstants.QUEUE_POST_GENERATE);
        log.debug("Post generation worker is active. Queue depth: {}", queueDepth);
    }
}
