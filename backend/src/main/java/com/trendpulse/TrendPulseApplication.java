package com.trendpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot Application for Trend Pulse Spark
 * 
 * A monolithic event-driven platform for:
 * - Reddit data ingestion
 * - Trend detection and analysis
 * - AI-powered content generation
 * - Automated Reddit posting
 * - Analytics dashboard
 */
@SpringBootApplication
@EnableJpaRepositories
@EnableCaching
@EnableScheduling
@EnableAsync
@EnableRetry
public class TrendPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrendPulseApplication.class, args);
    }
}
