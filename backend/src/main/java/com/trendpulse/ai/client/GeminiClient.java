package com.trendpulse.ai.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trendpulse.ai.dto.AIAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Gemini 1.5 Flash API client
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {
    
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;
    
    @Value("${app.ai.gemini.api-key}")
    private String apiKey;
    
    @Value("${app.ai.gemini.model:gemini-1.5-flash}")
    private String model;

    private boolean isMockMode() {
        return "your-gemini-api-key".equals(apiKey) || "your_gemini_api_key".equals(apiKey);
    }
    
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
    
    /**
     * Analyze trend data with Gemini
     */
    public AIAnalysisResponse analyzeTrend(String topic, String subreddit, String postsData) {
        if (isMockMode()) {
            log.info("Using Mock Mode for Gemini analysis on topic: {}", topic);
            return AIAnalysisResponse.builder()
                    .summary("This trend explores the latest developments in AI technology, showing significant community interest and high engagement levels.")
                    .sentiment("positive")
                    .keyInsights("Strong positive sentiment;Rapidly growing interest;High discussion volume")
                    .contentSuggestions("Post about future predictions;Compare with similar technologies")
                    .confidenceScore(0.9)
                    .build();
        }
        log.info("Analyzing trend '{}' from r/{} with Gemini", topic, subreddit);
        
        try {
            String prompt = buildAnalysisPrompt(topic, subreddit, postsData);
            
            String response = callGeminiAPI(prompt);
            
            return parseGeminiResponse(response);
            
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage(), e);
            return createFallbackResponse();
        }
    }
    
    /**
     * Generate content suggestions with Gemini
     */
    public String generateContentSuggestions(String topic, String summary, String insights) {
        log.info("Generating content suggestions for topic: {}", topic);
        
        try {
            String prompt = buildContentPrompt(topic, summary, insights);
            
            return callGeminiAPI(prompt);
            
        } catch (Exception e) {
            log.error("Content generation failed: {}", e.getMessage(), e);
            return "Failed to generate content suggestions";
        }
    }
    
    /**
     * Call Gemini API
     */
    private String callGeminiAPI(String prompt) {
        String url = GEMINI_API_URL + model + ":generateContent?key=" + apiKey;
        
        Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                Map.of(
                    "parts", new Object[]{
                        Map.of("text", prompt)
                    }
                )
            }
        );
        
        WebClient webClient = webClientBuilder.build();
        
        JsonNode response = webClient.post()
                .uri(url)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        
        if (response != null && response.has("candidates")) {
            JsonNode candidates = response.get("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null && content.has("parts")) {
                    JsonNode parts = content.get("parts");
                    if (parts.isArray() && parts.size() > 0) {
                        return parts.get(0).get("text").asText();
                    }
                }
            }
        }
        
        throw new RuntimeException("Invalid Gemini API response");
    }
    
    /**
     * Build analysis prompt
     */
    private String buildAnalysisPrompt(String topic, String subreddit, String postsData) {
        return String.format("""
            Analyze this trending topic from Reddit:
            
            Topic: %s
            Subreddit: r/%s
            
            Sample Posts Data:
            %s
            
            Provide a JSON response with:
            1. summary: Brief overview of the trend (2-3 sentences)
            2. sentiment: Overall sentiment (positive/negative/neutral/mixed)
            3. keyInsights: 3-5 key insights about why this is trending
            4. contentSuggestions: Ideas for engaging Reddit posts about this topic
            5. confidenceScore: Your confidence in this analysis (0.0-1.0)
            
            Format as JSON only, no markdown.
            """, topic, subreddit, postsData.substring(0, Math.min(1000, postsData.length())));
    }
    
    /**
     * Build content generation prompt
     */
    private String buildContentPrompt(String topic, String summary, String insights) {
        return String.format("""
            Generate 3 engaging Reddit post ideas about this trending topic:
            
            Topic: %s
            Summary: %s
            Key Insights: %s
            
            For each post idea, provide:
            - Title (catchy and Reddit-appropriate)
            - Content (2-3 paragraphs, informative and engaging)
            - Suggested subreddit
            
            Make it conversational and authentic for Reddit's audience.
            """, topic, summary, insights);
    }
    
    /**
     * Parse Gemini response into structured data
     */
    private AIAnalysisResponse parseGeminiResponse(String response) {
        try {
            // Try to parse as JSON
            if (response.trim().startsWith("{")) {
                JsonNode json = objectMapper.readTree(response);
                
                return AIAnalysisResponse.builder()
                        .summary(json.has("summary") ? json.get("summary").asText() : "")
                        .sentiment(json.has("sentiment") ? json.get("sentiment").asText() : "neutral")
                        .keyInsights(json.has("keyInsights") ? json.get("keyInsights").asText() : "")
                        .contentSuggestions(json.has("contentSuggestions") ? json.get("contentSuggestions").asText() : "")
                        .confidenceScore(json.has("confidenceScore") ? json.get("confidenceScore").asDouble() : 0.7)
                        .build();
            }
            
            // Fallback: treat entire response as summary
            return AIAnalysisResponse.builder()
                    .summary(response.substring(0, Math.min(500, response.length())))
                    .sentiment("neutral")
                    .keyInsights("Analysis completed")
                    .contentSuggestions("See summary for details")
                    .confidenceScore(0.6)
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
            return createFallbackResponse();
        }
    }
    
    /**
     * Create fallback response on error
     */
    private AIAnalysisResponse createFallbackResponse() {
        return AIAnalysisResponse.builder()
                .summary("AI analysis temporarily unavailable")
                .sentiment("neutral")
                .keyInsights("Manual review recommended")
                .contentSuggestions("Check trend data manually")
                .confidenceScore(0.0)
                .build();
    }
}
