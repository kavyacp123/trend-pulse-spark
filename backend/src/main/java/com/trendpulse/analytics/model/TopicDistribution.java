package com.trendpulse.analytics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Topic distribution entity
 */
@Entity
@Table(name = "topic_distribution", indexes = {
    @Index(name = "idx_topic_dist_subreddit", columnList = "subreddit"),
    @Index(name = "idx_topic_dist_topic", columnList = "topic")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicDistribution {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String topic;
    
    @Column(nullable = false)
    private String subreddit;
    
    @Column(nullable = false)
    private Integer frequency;
    
    @Column(name = "avg_score")
    private Double avgScore;
}
