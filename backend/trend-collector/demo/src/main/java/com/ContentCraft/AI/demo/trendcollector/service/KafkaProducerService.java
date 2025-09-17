package com.ContentCraft.AI.demo.trendcollector.service;

import java.util.List;
import com.ContentCraft.AI.demo.trendcollector.model.SocialMediaPost;
import com.ContentCraft.AI.demo.trendcollector.model.TrendData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Value("${app.kafka.topics.raw-posts}")
    private String rawPostsTopic;

    @Value("${app.kafka.topics.trends}")
    private String trendsTopic;

    @Autowired
    private ObjectMapper objectMapper;

    public void publishRawPosts(List<SocialMediaPost> posts) {
        try {
            String jsonData = objectMapper.writeValueAsString(posts);
            kafkaTemplate.send(rawPostsTopic, jsonData)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Published {} posts to {}", posts.size(), rawPostsTopic);
                        } else {
                            log.error("Failed to publish posts", ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error serializing posts for Kafka", e);
        }
    }

    public void publishTrendData(TrendData trendData) {
        try {
            String jsonData = objectMapper.writeValueAsString(trendData);
            kafkaTemplate.send(trendsTopic, trendData.getPlatform(), jsonData)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Published trend data for {} to {}",
                                    trendData.getPlatform(), trendsTopic);
                        } else {
                            log.error("Failed to publish trend data", ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Error serializing trend data for Kafka", e);
        }
    }

}
