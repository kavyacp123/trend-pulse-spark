package com.ContentCraft.AI.demo.trendcollector.service;
import org.springframework.http.HttpStatusCode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class SocialMediaApiClient {

    @Autowired
    @Qualifier("twitterWebClient")
    private WebClient twitterWebClient;

    @Autowired
    @Qualifier("redditWebClient")
    private WebClient redditWebClient;

    public Mono<String> fetchTwitterTrends() {
        return twitterWebClient.get()
                .uri("/tweets/search/recent?query=%23trending&max_results=100")
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("Twitter API error: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Twitter API failed"));
                })
                .bodyToMono(String.class)
                .doOnError(error -> log.error("Error fetching Twitter trends", error));
    }

    public Mono<String> fetchRedditTrends() {
        return redditWebClient.get()
                .uri("/r/all/hot.json?limit=10")
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("Reddit API error: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Reddit API failed"));
                })
                .bodyToMono(String.class)
                .doOnError(error -> log.error("Error fetching Reddit trends", error));
    }

}
