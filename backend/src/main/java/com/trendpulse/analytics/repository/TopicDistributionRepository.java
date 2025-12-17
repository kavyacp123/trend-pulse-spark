package com.trendpulse.analytics.repository;

import com.trendpulse.analytics.model.TopicDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for TopicDistribution entity
 */
@Repository
public interface TopicDistributionRepository extends JpaRepository<TopicDistribution, Long> {
    
    List<TopicDistribution> findBySubredditOrderByFrequencyDesc(String subreddit);
    
    @Query("SELECT td FROM TopicDistribution td ORDER BY td.frequency DESC")
    List<TopicDistribution> findTopTopics();
    
    @Query("SELECT td.subreddit, COUNT(td) as trendCount FROM TopicDistribution td GROUP BY td.subreddit ORDER BY trendCount DESC")
    List<Object[]> getSubredditStats();
}
