package com.trendpulse.analytics.service;

import com.trendpulse.analytics.dto.TopicDistributionResponse;
import com.trendpulse.analytics.model.TopicDistribution;
import com.trendpulse.analytics.repository.TopicDistributionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for topic distribution analytics
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TopicDistributionService {
    
    private final TopicDistributionRepository topicDistributionRepository;
    
    /**
     * Get topic distribution for a subreddit
     */
    @Cacheable(value = "analytics:topics", key = "#subreddit + ':' + #limit", unless = "#result == null")
    public List<TopicDistributionResponse> getTopicDistribution(String subreddit, int limit) {
        log.info("Fetching topic distribution for r/{}, limit: {}", subreddit, limit);
        
        List<TopicDistribution> distributions = topicDistributionRepository
                .findBySubredditOrderByFrequencyDesc(subreddit);
        
        int totalFrequency = distributions.stream()
                .mapToInt(TopicDistribution::getFrequency)
                .sum();
        
        return distributions.stream()
                .limit(limit)
                .map(dist -> TopicDistributionResponse.builder()
                        .topic(dist.getTopic())
                        .frequency(dist.getFrequency())
                        .percentage(totalFrequency > 0 ? 
                                (dist.getFrequency() * 100.0 / totalFrequency) : 0)
                        .avgScore(dist.getAvgScore())
                        .subreddit(dist.getSubreddit())
                        .build())
                .collect(Collectors.toList());
    }
}
