package com.trendpulse.queue.producer;

import com.trendpulse.queue.model.QueueMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * Redis-based queue producer implementation
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedisQueueProducer implements QueueProducer {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Override
    @Retryable(
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public <T> void publish(String queueName, T payload) {
        QueueMessage<T> message = QueueMessage.<T>builder()
                .queueName(queueName)
                .payload(payload)
                .build();
        
        redisTemplate.opsForList().rightPush(queueName, message);
        log.debug("Published message to queue: {} with ID: {}", queueName, message.getMessageId());
    }
    
    @Override
    @Retryable(
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public <T> void publishWithPriority(String queueName, T payload, int priority) {
        QueueMessage<T> message = QueueMessage.<T>builder()
                .queueName(queueName)
                .payload(payload)
                .priority(priority)
                .build();
        
        // Higher priority goes to the front
        if (priority > 5) {
            redisTemplate.opsForList().leftPush(queueName, message);
        } else {
            redisTemplate.opsForList().rightPush(queueName, message);
        }
        
        log.debug("Published priority message to queue: {} with ID: {} and priority: {}", 
                queueName, message.getMessageId(), priority);
    }
    
    @Override
    public <T> void publishWithDelay(String queueName, T payload, long delayMs) {
        QueueMessage<T> message = QueueMessage.<T>builder()
                .queueName(queueName)
                .payload(payload)
                .build();
        
        String delayedQueue = queueName + ":delayed";
        redisTemplate.opsForValue().set(
                delayedQueue + ":" + message.getMessageId(),
                message,
                delayMs,
                TimeUnit.MILLISECONDS
        );
        
        log.debug("Published delayed message to queue: {} with delay: {}ms", queueName, delayMs);
    }
}
