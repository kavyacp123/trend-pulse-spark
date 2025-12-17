package com.trendpulse.ingestion.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.trendpulse.auth.model.User;
import com.trendpulse.auth.service.RedditOAuthService;
import com.trendpulse.common.exception.ServiceException;
import com.trendpulse.ingestion.model.RedditPost;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Reddit API client for fetching posts
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RedditApiClient {
    
    private final WebClient.Builder webClientBuilder;
    private final RedditOAuthService redditOAuthService;
    
    @Value("${app.reddit.api-url}")
    private String redditApiUrl;
    
    @Value("${app.reddit.user-agent}")
    private String userAgent;
    
    /**
     * Fetch hot posts from a subreddit
     */
    @CircuitBreaker(name = "reddit-api", fallbackMethod = "fetchPostsFallback")
    @RateLimiter(name = "reddit-api")
    public List<RedditPost> fetchHotPosts(User user, String subreddit, int limit) {
        String accessToken = redditOAuthService.getRedditAccessToken(user);
        
        WebClient webClient = webClientBuilder.build();
        
        String url = String.format("%s/r/%s/hot.json?limit=%d", redditApiUrl, subreddit, limit);
        
        JsonNode response = webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + accessToken)
                .header("User-Agent", userAgent)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        
        return parseRedditResponse(response);
    }
    
    /**
     * Fetch new posts from a subreddit
     */
    @CircuitBreaker(name = "reddit-api", fallbackMethod = "fetchPostsFallback")
    @RateLimiter(name = "reddit-api")
    public List<RedditPost> fetchNewPosts(User user, String subreddit, int limit) {
        String accessToken = redditOAuthService.getRedditAccessToken(user);
        
        WebClient webClient = webClientBuilder.build();
        
        String url = String.format("%s/r/%s/new.json?limit=%d", redditApiUrl, subreddit, limit);
        
        JsonNode response = webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + accessToken)
                .header("User-Agent", userAgent)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
        
        return parseRedditResponse(response);
    }
    
    /**
     * Parse Reddit API response into RedditPost objects
     */
    private List<RedditPost> parseRedditResponse(JsonNode response) {
        List<RedditPost> posts = new ArrayList<>();
        
        if (response == null || !response.has("data")) {
            return posts;
        }
        
        JsonNode children = response.get("data").get("children");
        
        if (children == null || !children.isArray()) {
            return posts;
        }
        
        for (JsonNode child : children) {
            JsonNode data = child.get("data");
            
            if (data == null) {
                continue;
            }
            
            RedditPost post = RedditPost.builder()
                    .id(data.has("id") ? data.get("id").asText() : null)
                    .title(data.has("title") ? data.get("title").asText() : null)
                    .selftext(data.has("selftext") ? data.get("selftext").asText() : null)
                    .author(data.has("author") ? data.get("author").asText() : null)
                    .subreddit(data.has("subreddit") ? data.get("subreddit").asText() : null)
                    .permalink(data.has("permalink") ? data.get("permalink").asText() : null)
                    .url(data.has("url") ? data.get("url").asText() : null)
                    .score(data.has("score") ? data.get("score").asInt() : 0)
                    .numComments(data.has("num_comments") ? data.get("num_comments").asInt() : 0)
                    .ups(data.has("ups") ? data.get("ups").asInt() : 0)
                    .downs(data.has("downs") ? data.get("downs").asInt() : 0)
                    .upvoteRatio(data.has("upvote_ratio") ? data.get("upvote_ratio").asDouble() : 0.0)
                    .createdUtc(data.has("created_utc") ? 
                            Instant.ofEpochSecond(data.get("created_utc").asLong()) : Instant.now())
                    .isVideo(data.has("is_video") && data.get("is_video").asBoolean())
                    .isSelf(data.has("is_self") && data.get("is_self").asBoolean())
                    .over18(data.has("over_18") && data.get("over_18").asBoolean())
                    .spoiler(data.has("spoiler") && data.get("spoiler").asBoolean())
                    .thumbnail(data.has("thumbnail") ? data.get("thumbnail").asText() : null)
                    .domain(data.has("domain") ? data.get("domain").asText() : null)
                    .build();
            
            posts.add(post);
        }
        
        log.info("Parsed {} posts from Reddit response", posts.size());
        return posts;
    }
    
    /**
     * Fallback method for circuit breaker
     */
    private List<RedditPost> fetchPostsFallback(User user, String subreddit, int limit, Exception e) {
        log.error("Reddit API call failed, using fallback. Subreddit: {}, Error: {}", 
                subreddit, e.getMessage());
        throw new ServiceException("Reddit API is currently unavailable", e);
    }
}
