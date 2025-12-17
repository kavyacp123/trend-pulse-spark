package com.trendpulse.redditposting.repository;

import com.trendpulse.redditposting.model.PostSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for PostSubmission entity
 */
@Repository
public interface PostSubmissionRepository extends JpaRepository<PostSubmission, Long> {
    
    Optional<PostSubmission> findByGeneratedPostId(Long generatedPostId);
    
    List<PostSubmission> findByStatusOrderByCreatedAtDesc(String status);
    
    List<PostSubmission> findBySubredditOrderBySubmittedAtDesc(String subreddit);
    
    List<PostSubmission> findBySubmittedAtAfterOrderBySubmittedAtDesc(Instant since);
    
    long countByStatus(String status);
}
