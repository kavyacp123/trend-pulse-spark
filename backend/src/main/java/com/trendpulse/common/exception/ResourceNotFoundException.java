package com.trendpulse.common.exception;

/**
 * Exception thrown when a resource is not found
 */
public class ResourceNotFoundException extends ServiceException {
    
    public ResourceNotFoundException(String resource, String identifier) {
        super(String.format("%s not found with identifier: %s", resource, identifier));
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
