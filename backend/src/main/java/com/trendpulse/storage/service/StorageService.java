package com.trendpulse.storage.service;

import com.trendpulse.storage.model.StorageMetadata;

import java.io.InputStream;

/**
 * Interface for object storage operations
 */
public interface StorageService {
    
    /**
     * Upload an object to storage
     */
    StorageMetadata upload(String bucketName, String objectKey, InputStream data, 
                          String contentType, long size);
    
    /**
     * Download an object from storage
     */
    InputStream download(String bucketName, String objectKey);
    
    /**
     * Check if an object exists
     */
    boolean exists(String bucketName, String objectKey);
    
    /**
     * Delete an object
     */
    void delete(String bucketName, String objectKey);
    
    /**
     * Ensure bucket exists, create if not
     */
    void ensureBucketExists(String bucketName);
}
