package com.ContentCraft.AI.demo.trendcollector.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @Qualifier("twitterWebClient")
    public WebClient twitterWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.twitter.com/2")
                .defaultHeader("Authorization", "Bearer ${twitter.api.key}")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    @Qualifier("redditWebClient")
    public WebClient redditWebClient() {
        return WebClient.builder()
                .baseUrl("https://www.reddit.com")
                .defaultHeader("User-Agent", "TrendCollector/1.0")
                .build();
    }
}
