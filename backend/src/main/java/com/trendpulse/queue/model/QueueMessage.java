package com.trendpulse.queue.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Standard queue message wrapper with idempotency support
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueMessage<T> {
    
    @Builder.Default
    private String messageId = UUID.randomUUID().toString();
    
    private String queueName;
    
    private T payload;
    
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    private int retryCount;
    
    private Integer priority;
}
