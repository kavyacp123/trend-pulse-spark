package com.trendpulse.ai.service;

import com.trendpulse.ai.client.GeminiClient;
import com.trendpulse.ai.dto.AIAnalysisRequest;
import com.trendpulse.ai.dto.AIAnalysisResponse;
import com.trendpulse.ai.model.AIAnalysis;
import com.trendpulse.ai.repository.AIAnalysisRepository;
import com.trendpulse.common.constants.AppConstants;
import com.trendpulse.ingestion.model.RedditPost;
import com.trendpulse.ingestion.service.ObjectStorageService;
import com.trendpulse.queue.producer.QueueProducer;
import com.trendpulse.trendengine.dto.AIAnalysisJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for AI-powered trend analysis
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIAnalysisService {
    
    private final GeminiClient geminiClient;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final ObjectStorageService objectStorageService;
    private final QueueProducer queueProducer;
    
    /**
     * Analyze a trend using AI
     */
    @Transactional
    public AIAnalysis analyzeTrend(AIAnalysisJob job) {
        log.info("Starting AI analysis for trend: {} ({})", job.getTopic(), job.getTrendId());
        
        try {
            // Retrieve raw Reddit data
            List<RedditPost> posts = objectStorageService.retrieveRedditPosts(job.getRawDataPath());
            
            // Prepare posts data for AI
            String postsData = preparePostsData(posts);
            
            // Call Gemini API
            AIAnalysisResponse response = geminiClient.analyzeTrend(
                    job.getTopic(),
                    job.getSubreddit(),
                    postsData
            );
            
            // Save analysis results
            AIAnalysis analysis = AIAnalysis.builder()
                    .trendId(job.getTrendId())
                    .summary(response.getSummary())
                    .sentiment(response.getSentiment())
                    .keyInsights(response.getKeyInsights())
                    .contentSuggestions(response.getContentSuggestions())
                    .confidenceScore(response.getConfidenceScore())
                    .modelUsed("gemini-1.5-flash")
                    .build();
            
            analysis = aiAnalysisRepository.save(analysis);
            
            log.info("AI analysis completed for trend: {}", job.getTopic());
            
            // Publish to post generation queue
            publishToPostGeneration(analysis, job);
            
            return analysis;
            
        } catch (Exception e) {
            log.error("AI analysis failed for trend: {}", job.getTopic(), e);
            throw e;
        }
    }
    
    /**
     * Prepare posts data for AI analysis
     */
    private String preparePostsData(List<RedditPost> posts) {
        StringBuilder sb = new StringBuilder();
        
        int limit = Math.min(10, posts.size());
        for (int i = 0; i < limit; i++) {
            RedditPost post = posts.get(i);
            sb.append("Title: ").append(post.getTitle()).append("\n");
            if (post.getSelftext() != null && !post.getSelftext().isEmpty()) {
                sb.append("Content: ").append(post.getSelftext(), 0, Math.min(200, post.getSelftext().length())).append("\n");
            }
            sb.append("Score: ").append(post.getScore()).append(", Comments: ").append(post.getNumComments()).append("\n\n");
        }
        
        return sb.toString();
    }
    
    /**
     * Publish to post generation queue
     */
    private void publishToPostGeneration(AIAnalysis analysis, AIAnalysisJob job) {
        // Create post generation job
        var postGenJob = com.trendpulse.postgenerator.dto.PostGenerationJob.builder()
                .trendId(job.getTrendId())
                .topic(job.getTopic())
                .subreddit(job.getSubreddit())
                .aiAnalysisId(analysis.getId())
                .summary(analysis.getSummary())
                .keyInsights(analysis.getKeyInsights())
                .contentSuggestions(analysis.getContentSuggestions())
                .build();
        
        queueProducer.publish(AppConstants.QUEUE_POST_GENERATE, postGenJob);
        
        log.info("Published to post generation queue for trend: {}", job.getTopic());
    }
    
    /**
     * Get analysis by trend ID
     */
    public AIAnalysis getAnalysisByTrendId(Long trendId) {
        return aiAnalysisRepository.findByTrendId(trendId)
                .orElse(null);
    }
}
