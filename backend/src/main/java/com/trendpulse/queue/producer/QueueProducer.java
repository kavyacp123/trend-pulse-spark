package com.trendpulse.queue.producer;

import com.trendpulse.queue.model.QueueMessage;

/**
 * Interface for queue producers
 */
public interface QueueProducer {
    
    /**
     * Publish a message to a queue
     */
    <T> void publish(String queueName, T payload);
    
    /**
     * Publish a message with priority
     */
    <T> void publishWithPriority(String queueName, T payload, int priority);
    
    /**
     * Publish a message with delay
     */
    <T> void publishWithDelay(String queueName, T payload, long delayMs);
}
