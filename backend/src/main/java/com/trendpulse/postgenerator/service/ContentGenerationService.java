package com.trendpulse.postgenerator.service;

import com.trendpulse.ai.client.GeminiClient;
import com.trendpulse.postgenerator.dto.PostGenerationJob;
import com.trendpulse.postgenerator.model.GeneratedPost;
import com.trendpulse.postgenerator.repository.GeneratedPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for generating Reddit posts using AI
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ContentGenerationService {
    
    private final GeminiClient geminiClient;
    private final GeneratedPostRepository generatedPostRepository;
    
    /**
     * Generate Reddit post from AI analysis
     */
    @Transactional
    public GeneratedPost generatePost(PostGenerationJob job) {
        log.info("Generating post for trend: {}", job.getTopic());
        
        try {
            // Generate content using Gemini
            String contentSuggestions = geminiClient.generateContentSuggestions(
                    job.getTopic(),
                    job.getSummary(),
                    job.getKeyInsights()
            );
            
            // Parse and create post
            GeneratedPost post = parseGeneratedContent(job, contentSuggestions);
            
            post = generatedPostRepository.save(post);
            
            log.info("Generated post ID: {} for trend: {}", post.getId(), job.getTopic());
            
            return post;
            
        } catch (Exception e) {
            log.error("Post generation failed for trend: {}", job.getTopic(), e);
            throw e;
        }
    }
    
    /**
     * Parse generated content into post
     */
    private GeneratedPost parseGeneratedContent(PostGenerationJob job, String content) {
        // Simple parsing - in production, would parse structured output
        String title = extractTitle(content, job.getTopic());
        String postContent = content.substring(0, Math.min(2000, content.length()));
        
        return GeneratedPost.builder()
                .trendId(job.getTrendId())
                .aiAnalysisId(job.getAiAnalysisId())
                .title(title)
                .content(postContent)
                .targetSubreddit(job.getSubreddit())
                .status("draft")
                .build();
    }
    
    /**
     * Extract title from generated content
     */
    private String extractTitle(String content, String topic) {
        // Look for "Title:" in content
        if (content.contains("Title:")) {
            int start = content.indexOf("Title:") + 6;
            int end = content.indexOf("\n", start);
            if (end > start) {
                return content.substring(start, end).trim();
            }
        }
        
        // Fallback: generate simple title
        return "Trending: " + topic;
    }
    
    /**
     * Get posts by trend ID
     */
    public java.util.List<GeneratedPost> getPostsByTrendId(Long trendId) {
        return generatedPostRepository.findByTrendIdOrderByCreatedAtDesc(trendId);
    }
}
