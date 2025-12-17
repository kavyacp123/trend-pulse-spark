package com.trendpulse.postgenerator.repository;

import com.trendpulse.postgenerator.model.GeneratedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for GeneratedPost entity
 */
@Repository
public interface GeneratedPostRepository extends JpaRepository<GeneratedPost, Long> {
    
    List<GeneratedPost> findByTrendIdOrderByCreatedAtDesc(Long trendId);
    
    List<GeneratedPost> findByStatusOrderByCreatedAtDesc(String status);
    
    long countByStatus(String status);
}
