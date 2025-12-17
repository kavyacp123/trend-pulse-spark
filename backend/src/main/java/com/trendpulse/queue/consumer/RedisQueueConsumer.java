package com.trendpulse.queue.consumer;

import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.queue.model.QueueMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * Redis-based queue consumer with retry and DLQ support
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisQueueConsumer {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private static final int MAX_RETRIES = 3;
    
    /**
     * Consume and process a message from the queue
     */
    public <T> void consume(String queueName, MessageHandler<T> handler, Class<T> payloadClass) {
        try {
            Object rawMessage = redisTemplate.opsForList()
                    .leftPop(queueName, 5, TimeUnit.SECONDS);
            
            if (rawMessage == null) {
                return; // No message available
            }
            
            @SuppressWarnings("unchecked")
            QueueMessage<T> message = (QueueMessage<T>) rawMessage;
            
            try {
                handler.handle(message);
                log.debug("Successfully processed message: {}", message.getMessageId());
            } catch (Exception e) {
                handleFailure(queueName, message, e);
            }
            
        } catch (Exception e) {
            log.error("Error consuming from queue: {}", queueName, e);
        }
    }
    
    /**
     * Handle message processing failure with retry logic
     */
    private <T> void handleFailure(String queueName, QueueMessage<T> message, Exception error) {
        int retryCount = message.getRetryCount();
        
        if (retryCount < MAX_RETRIES) {
            // Increment retry count and re-queue
            message.setRetryCount(retryCount + 1);
            redisTemplate.opsForList().rightPush(queueName, message);
            
            log.warn("Message {} failed, retry {}/{}: {}", 
                    message.getMessageId(), retryCount + 1, MAX_RETRIES, error.getMessage());
        } else {
            // Send to Dead Letter Queue
            String dlq = queueName + AppConstants.DLQ_SUFFIX;
            redisTemplate.opsForList().rightPush(dlq, message);
            
            log.error("Message {} exceeded max retries, sent to DLQ: {}", 
                    message.getMessageId(), dlq, error);
        }
    }
    
    /**
     * Get queue depth
     */
    public Long getQueueDepth(String queueName) {
        return redisTemplate.opsForList().size(queueName);
    }
}
