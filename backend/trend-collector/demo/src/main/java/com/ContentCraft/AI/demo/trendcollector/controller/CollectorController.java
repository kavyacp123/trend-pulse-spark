package com.ContentCraft.AI.demo.trendcollector.controller;

import com.ContentCraft.AI.demo.trendcollector.service.SocialMediaApiClient;
import com.ContentCraft.AI.demo.trendcollector.service.TrendCollectionService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api/collector")
@Slf4j
public class CollectorController {

    @Autowired
    private TrendCollectionService collectionService;

    @Autowired
    private SocialMediaApiClient apiClient;

    @PostMapping("/collect/twitter")
    public ResponseEntity<String> triggerTwitterCollection() {
        try {
            collectionService.collectTwitterTrends();
            return ResponseEntity.ok("Twitter collection triggered successfully");
        } catch (Exception e) {
            log.error("Manual Twitter collection failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Twitter collection failed: " + e.getMessage());
        }
    }

    @PostMapping("/collect/reddit")
    public ResponseEntity<String> triggerRedditCollection() {
        try {
            collectionService.collectRedditTrends();
            return ResponseEntity.ok("Reddit collection triggered successfully");
        } catch (Exception e) {
            log.error("Manual Reddit collection failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Reddit collection failed: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getCollectorStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Trend Data Collector");
        status.put("status", "RUNNING");
        status.put("timestamp", Instant.now());
        status.put("version", "1.0.0");

        return ResponseEntity.ok(status);
    }
}

