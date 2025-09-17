package com.ContentCraft.AI.demo.trendcollector.service;

import com.ContentCraft.AI.demo.trendcollector.model.SocialMediaPost;
import com.ContentCraft.AI.demo.trendcollector.model.TrendData;
import com.ContentCraft.AI.demo.trendcollector.service.DataProcessingService;
import com.ContentCraft.AI.demo.trendcollector.service.KafkaProducerService;
import com.ContentCraft.AI.demo.trendcollector.service.SocialMediaApiClient;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;


@Service
@Slf4j
public class TrendCollectionService {

    @Autowired
    private SocialMediaApiClient apiClient;

    @Autowired
    private DataProcessingService dataProcessingService;

    @Autowired
    private KafkaProducerService kafkaProducer;

    @Scheduled(fixedRateString = "${app.collection.interval}")
    public void collectTwitterTrends() {
        log.info("Starting Twitter trend collection...");

//        apiClient.fetchTwitterTrends()
//                .doOnNext(this::processTwitterData)
//                .doOnError(error -> log.error("Twitter collection failed", error))
//                .subscribe();
    }

    @Scheduled(fixedRateString = "${app.collection.interval}")
    public void collectRedditTrends() {
        log.info("Starting Reddit trend collection...");

        apiClient.fetchRedditTrends()
                .doOnNext(this::processRedditData)
                .doOnError(error -> log.error("Reddit collection failed", error))
                .subscribe();
    }

    private void processTwitterData(String twitterJson) {
        log.info("Twitter collection disabled - no API key configured");
//        List<SocialMediaPost> posts = dataProcessingService.processTwitterData(twitterJson);
//        if (!posts.isEmpty()) {
//            kafkaProducer.publishRawPosts(posts);
//
//            TrendData trendData = TrendData.builder()
//                    .posts(posts)
//                    .platform("TWITTER")
//                    .collectedAt(Instant.now())
//                    .totalPosts(posts.size())
//                    .build();
//
//            kafkaProducer.publishTrendData(trendData);
//            log.info("Processed {} Twitter posts", posts.size());
//        }
    }

    private void processRedditData(String redditJson) {
        List<SocialMediaPost> posts = dataProcessingService.processRedditData(redditJson);
        if (!posts.isEmpty()) {
            kafkaProducer.publishRawPosts(posts);

            TrendData trendData = TrendData.builder()
                    .posts(posts)
                    .platform("REDDIT")
                    .collectedAt(Instant.now())
                    .totalPosts(posts.size())
                    .build();

            kafkaProducer.publishTrendData(trendData);
            log.info("Processed {} Reddit posts", posts.size());
        }
    }
}





