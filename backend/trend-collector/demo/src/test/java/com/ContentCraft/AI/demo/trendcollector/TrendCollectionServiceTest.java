package com.ContentCraft.AI.demo.trendcollector;

import com.ContentCraft.AI.demo.trendcollector.service.TrendCollectionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest
class TrendCollectionServiceTest {

    @Autowired
    private TrendCollectionService collectionService;

    @Test
    void testTwitterCollection() {
        // This will test the scheduled method manually
        assertDoesNotThrow(() -> collectionService.collectRedditTrends());
    }
}
