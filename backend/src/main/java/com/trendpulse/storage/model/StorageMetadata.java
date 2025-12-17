package com.trendpulse.storage.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Metadata for stored objects
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageMetadata {
    
    private String objectKey;
    private String bucketName;
    private Long size;
    private String contentType;
    private Instant uploadedAt;
    private String etag;
}
