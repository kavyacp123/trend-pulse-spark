package com.trendpulse.ai.repository;

import com.trendpulse.ai.model.AIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for AIAnalysis entity
 */
@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {
    
    Optional<AIAnalysis> findByTrendId(Long trendId);
    
    List<AIAnalysis> findByTrendIdOrderByCreatedAtDesc(Long trendId);
    
    List<AIAnalysis> findBySentiment(String sentiment);
    
    long countByModelUsed(String modelUsed);
}
