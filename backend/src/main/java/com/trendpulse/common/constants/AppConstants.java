package com.trendpulse.common.constants;

/**
 * Application-wide constants
 */
public final class AppConstants {
    
    private AppConstants() {
        // Prevent instantiation
    }
    
    // Queue Names
    public static final String QUEUE_AI_ANALYSIS = "ai:analysis:queue";
    public static final String QUEUE_POST_GENERATE = "post:generate:queue";
    public static final String QUEUE_POST_PUBLISH = "post:publish:queue";
    
    // Dead Letter Queues
    public static final String DLQ_SUFFIX = ":dlq";
    
    // Cache Names
    public static final String CACHE_TRENDS = "trends";
    public static final String CACHE_ANALYTICS = "analytics";
    public static final String CACHE_DASHBOARD = "dashboard";
    
    // MinIO Buckets
    public static final String BUCKET_RAW_DATA = "trendpulse-raw-data";
    public static final String BUCKET_GENERATED_CONTENT = "trendpulse-generated";
    
    // Date Formats
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
}
