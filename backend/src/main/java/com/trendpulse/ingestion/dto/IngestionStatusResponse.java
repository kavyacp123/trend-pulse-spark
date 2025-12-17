package com.trendpulse.ingestion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Ingestion status response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngestionStatusResponse {
    
    private Long id;
    private String source;
    private String subreddit;
    private Integer postsFetched;
    private String status;
    private String storagePath;
    private Instant startedAt;
    private Instant completedAt;
    private Long durationMs;
}
