package com.example.TrendProcessorService;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TrendService {



    @Autowired
    private TrendAnalysisService trendAnalysisService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @KafkaListener(topics = "raw-social-posts")
    public void processRawPosts(String postsJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<SocialMediaPost> posts = mapper.readValue(postsJson,
                    new TypeReference<List<SocialMediaPost>>() {});

            log.info("Processing {} raw posts", posts.size());

            // Extract trends from posts
            List<Trend> trends = trendAnalysisService.extractTrends(posts);

            // Store in Redis for fast access
            cacheLatestTrends(trends);

            // Publish processed trends
            publishProcessedTrends(trends);

        } catch (Exception e) {
            log.error("Error processing raw posts", e);
        }
    }

    private void cacheLatestTrends(List<Trend> trends) {
        trends.forEach(trend -> {
            String key = "trend:" + trend.getPlatform() + ":" + trend.getHashtag();
            redisTemplate.opsForValue().set(key, trend, Duration.ofHours(1));
        });
    }
}
