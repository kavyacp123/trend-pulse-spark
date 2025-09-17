package com.ContentCraft.AI.demo.trendcollector.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import com.ContentCraft.AI.demo.trendcollector.model.SocialMediaPost;
import com.ContentCraft.AI.demo.trendcollector.model.dto.twitter.TwitterResponse;
import com.ContentCraft.AI.demo.trendcollector.model.dto.twitter.TwitterTweet;
import com.ContentCraft.AI.demo.trendcollector.model.dto.reddit.RedditResponse;
import com.ContentCraft.AI.demo.trendcollector.model.dto.reddit.RedditPostData;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
public class DataProcessingService {

    public List<SocialMediaPost> processTwitterData(String twitterJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            TwitterResponse response = mapper.readValue(twitterJson, TwitterResponse.class);

            return response.getData().stream()
                    .map(this::convertTwitterToPost)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error processing Twitter data", e);
            return Collections.emptyList();
        }
    }

    public List<SocialMediaPost> processRedditData(String redditJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            RedditResponse response = mapper.readValue(redditJson, RedditResponse.class);

            return response.getData().getChildren().stream()
                    .map(child -> convertRedditToPost(child.getData()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error processing Reddit data", e);
            return Collections.emptyList();
        }
    }

    private SocialMediaPost convertTwitterToPost(TwitterTweet tweet) {
        return SocialMediaPost.builder()
                .id(tweet.getId())
                .platform("TWITTER")
                .content(tweet.getText())
                .author(tweet.getAuthorId())
                .hashtags(extractHashtags(tweet.getText()))
                .timestamp(parseTwitterTimestamp(tweet.getCreatedAt()))
                .likes(tweet.getPublicMetrics() != null ? tweet.getPublicMetrics().getLikeCount() : 0)
                .shares(tweet.getPublicMetrics() != null ? tweet.getPublicMetrics().getRetweetCount() : 0)
                .comments(tweet.getPublicMetrics() != null ? tweet.getPublicMetrics().getReplyCount() : 0)
                .build();
    }

    private SocialMediaPost convertRedditToPost(RedditPostData redditPost) {
        return SocialMediaPost.builder()
                .id(redditPost.getId())
                .platform("REDDIT")
                .content(redditPost.getTitle() + " " + (redditPost.getSelftext() != null ? redditPost.getSelftext() : ""))
                .author(redditPost.getAuthor())
                .hashtags(extractHashtags(redditPost.getTitle()))
                .timestamp(Instant.ofEpochSecond(redditPost.getCreated()))
                .likes(redditPost.getScore())
                .comments(redditPost.getNumComments())
                .url(redditPost.getUrl())
                .build();
    }

    private List<String> extractHashtags(String text) {
        if (text == null) return Collections.emptyList();

        return Arrays.stream(text.split("\\s+"))
                .filter(word -> word.startsWith("#"))
                .map(hashtag -> hashtag.replaceAll("[^a-zA-Z0-9#]", ""))
                .collect(Collectors.toList());
    }

    private Instant parseTwitterTimestamp(String timestamp) {
        try {
            return Instant.parse(timestamp);
        } catch (Exception e) {
            return Instant.now();
        }
    }
}
