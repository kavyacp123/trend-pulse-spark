package com.trendpulse.storage.service;

import com.trendpulse.common.exception.ServiceException;
import com.trendpulse.storage.model.StorageMetadata;
import io.minio.*;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

/**
 * MinIO implementation of storage service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class S3StorageService implements StorageService {
    
    private final MinioClient minioClient;
    
    @Override
    public StorageMetadata upload(String bucketName, String objectKey, InputStream data,
                                 String contentType, long size) {
        try {
            ensureBucketExists(bucketName);
            
            ObjectWriteResponse response = minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .stream(data, size, -1)
                            .contentType(contentType)
                            .build()
            );
            
            log.info("Uploaded object: {} to bucket: {}", objectKey, bucketName);
            
            return StorageMetadata.builder()
                    .objectKey(objectKey)
                    .bucketName(bucketName)
                    .size(size)
                    .contentType(contentType)
                    .uploadedAt(Instant.now())
                    .etag(response.etag())
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to upload object: {} to bucket: {}", objectKey, bucketName, e);
            throw new ServiceException("Failed to upload object to storage", e);
        }
    }
    
    @Override
    public InputStream download(String bucketName, String objectKey) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to download object: {} from bucket: {}", objectKey, bucketName, e);
            throw new ServiceException("Failed to download object from storage", e);
        }
    }
    
    @Override
    public boolean exists(String bucketName, String objectKey) {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
            return true;
        } catch (ErrorResponseException e) {
            if (e.errorResponse().code().equals("NoSuchKey")) {
                return false;
            }
            throw new ServiceException("Failed to check object existence", e);
        } catch (Exception e) {
            throw new ServiceException("Failed to check object existence", e);
        }
    }
    
    @Override
    public void delete(String bucketName, String objectKey) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
            log.info("Deleted object: {} from bucket: {}", objectKey, bucketName);
        } catch (Exception e) {
            log.error("Failed to delete object: {} from bucket: {}", objectKey, bucketName, e);
            throw new ServiceException("Failed to delete object from storage", e);
        }
    }
    
    @Override
    public void ensureBucketExists(String bucketName) {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
            
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build()
                );
                log.info("Created bucket: {}", bucketName);
            }
        } catch (Exception e) {
            log.error("Failed to ensure bucket exists: {}", bucketName, e);
            throw new ServiceException("Failed to ensure bucket exists", e);
        }
    }
}
