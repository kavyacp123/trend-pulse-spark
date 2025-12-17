package com.trendpulse.queue.consumer;

import com.trendpulse.queue.model.QueueMessage;

/**
 * Message handler interface for queue consumers
 */
@FunctionalInterface
public interface MessageHandler<T> {
    
    /**
     * Handle a queue message
     * 
     * @param message The queue message to process
     * @throws Exception if processing fails
     */
    void handle(QueueMessage<T> message) throws Exception;
}
