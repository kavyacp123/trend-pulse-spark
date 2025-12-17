# Trend Engine Package - Implementation Summary

## ✅ What's Been Implemented

### Entity & Repository

**Trend Entity** (`Trend.java`)
- Complete trend data model with metrics
- Fields: id, topic, subreddit, trendScore, velocity, engagementRate
- Counts: postCount, commentCount, upvoteCount
- Metadata: rawDataPath, status, detectedAt, firstSeenAt, lastUpdatedAt
- Database indexes on topic, subreddit, score, detected_at
- Auto-updating timestamps

**TrendRepository**
- Find by topic and subreddit
- Find by subreddit ordered by score
- Find top active trends
- Find recent trends (by date)
- Find trends by minimum score
- Count by status

### DTOs

**TrendResponse**
- API response with trend details

**AIAnalysisJob**
- Queue message payload for AI analysis
- Includes trendId, topic, subreddit, rawDataPath, priority, trendScore

### Services

**MetricsComputationService** (`MetricsComputationService.java`)
- **Trend Score Calculation**: Weighted combination of velocity + engagement
  - Formula: `(velocity × 0.4) + (engagementRate × 0.6)`
- **Velocity Calculation**: Posts per hour
- **Engagement Rate**: Average (comments + upvotes) per post
- **Topic Extraction**: Keyword frequency analysis from post titles
  - Filters stop words
  - Requires minimum 4 characters
  - Groups posts by significant words
- **Metrics Aggregation**: Total counts and averages

**TrendDetectionService** (`TrendDetectionService.java`)
- Orchestrates trend detection process
- Retrieves Reddit posts from MinIO
- Extracts trending topics using keyword analysis
- Calculates metrics for each topic
- Filters by minimum trend score threshold
- Creates or updates Trend entities
- Publishes to AI analysis queue
- Get top trends and trends by subreddit

**QueuePublishService** (`QueuePublishService.java`)
- Publishes trends to `ai:analysis:queue`
- Priority calculation based on trend score:
  - Score ≥ 1000: Priority 10
  - Score ≥ 500: Priority 8
  - Score ≥ 200: Priority 6
  - Score ≥ 100: Priority 4
  - Score < 100: Priority 2

### Worker

**TrendAnalysisWorker** (`TrendAnalysisWorker.java`)
- Scheduled trend analysis (every 30 minutes by default)
- Analyzes recent ingestions from last hour
- Processes completed ingestions only
- Logs statistics (ingestions analyzed, trends detected)
- Health check logging (every 5 minutes)

### Controller

**TrendController** (`/api/v1/trends`)
- `GET /` - Get all active trends (with limit)
- `GET /{id}` - Get trend by ID
- `GET /top?limit={n}` - Get top N trends
- `GET /subreddit/{name}` - Get trends by subreddit
- `GET /search?q={query}` - Search trends by topic
- `GET /recent` - Get trends from last 24 hours
- `POST /recompute` - Manual trend analysis (admin)

---

## 🔄 Trend Detection Flow

```
1. TrendAnalysisWorker (every 30 min)
   ↓
2. Get recent ingestions (last hour)
   ↓
3. For each completed ingestion:
   a. TrendDetectionService.analyzeTrends()
   b. Retrieve posts from MinIO
   c. MetricsComputationService.extractTrendingTopics()
      - Parse titles for keywords
      - Group posts by topic
      - Filter by minimum post count (3)
   d. For each topic:
      - Calculate velocity (posts/hour)
      - Calculate engagement rate
      - Calculate trend score
      - Check if score >= minTrendScore (50.0)
   e. Create/update Trend in database
   f. QueuePublishService.publishForAIAnalysis()
      - Create AIAnalysisJob
      - Calculate priority
      - Publish to ai:analysis:queue
   ↓
4. Trends stored in database
5. AI analysis jobs queued
```

---

## 📊 Trend Scoring Algorithm

### Velocity Calculation
```
velocity = total_posts / hours_since_oldest_post
```

### Engagement Rate Calculation
```
engagement_rate = avg((score + comments × 2) per post)
```

### Trend Score Calculation
```
trend_score = (velocity × 0.4) + (engagement_rate × 0.6)
```

**Example:**
- 50 posts in 2 hours → velocity = 25
- Average 100 upvotes + 20 comments per post → engagement = 140
- Trend score = (25 × 0.4) + (140 × 0.6) = 10 + 84 = **94**

---

## 🧪 Testing the Trend Engine

### 1. Prerequisites

- ✅ Ingestion completed (posts in MinIO)
- ✅ Application running
- ✅ Redis queue available

### 2. Manual Trigger

```bash
# Trigger trend analysis for specific ingestion
curl -X POST "http://localhost:8080/api/v1/trends/recompute?storagePath=reddit/technology/2025-12-17T12-30-00Z.json&subreddit=technology" \
  -H "Authorization: Bearer your-jwt-token"

# Response:
{
  "success": true,
  "message": "Detected 15 trends",
  "timestamp": "2025-12-17T12:45:00Z"
}
```

### 3. Get Top Trends

```bash
curl http://localhost:8080/api/v1/trends/top?limit=10 \
  -H "Authorization: Bearer your-jwt-token"

# Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "topic": "artificial",
      "subreddit": "technology",
      "trendScore": 245.8,
      "velocity": 12.5,
      "engagementRate": 320.4,
      "postCount": 25,
      "commentCount": 450,
      "upvoteCount": 5200,
      "status": "active",
      "detectedAt": "2025-12-17T12:30:00Z",
      "firstSeenAt": "2025-12-17T12:30:00Z"
    },
    ...
  ]
}
```

### 4. Search Trends

```bash
curl "http://localhost:8080/api/v1/trends/search?q=openai" \
  -H "Authorization: Bearer your-jwt-token"
```

### 5. Get Trends by Subreddit

```bash
curl http://localhost:8080/api/v1/trends/subreddit/technology \
  -H "Authorization: Bearer your-jwt-token"
```

### 6. Verify Queue

```bash
# Check Redis queue depth
docker exec -it trendpulse-redis redis-cli -a redis_pass

127.0.0.1:6379> LLEN ai:analysis:queue
(integer) 15
```

### 7. Verify Database

```sql
SELECT 
    topic, 
    subreddit, 
    trend_score, 
    post_count, 
    status 
FROM trends 
ORDER BY trend_score DESC 
LIMIT 10;
```

---

## ⚙️ Configuration

### Trend Detection Settings

In `application.yml`:

```yaml
app:
  trend:
    detection:
      min-score: 50.0
      velocity-weight: 0.4
      engagement-weight: 0.6
    analysis:
      schedule:
        cron: "0 */30 * * * *"  # Every 30 minutes
```

### Adjusting Sensitivity

**More Sensitive** (detect more trends):
```yaml
min-score: 20.0  # Lower threshold
```

**Less Sensitive** (only major trends):
```yaml
min-score: 100.0  # Higher threshold
```

**Favor Velocity** (fast-growing topics):
```yaml
velocity-weight: 0.7
engagement-weight: 0.3
```

**Favor Engagement** (highly discussed topics):
```yaml
velocity-weight: 0.3
engagement-weight: 0.7
```

---

## 📈 Sample Trends Output

```json
[
  {
    "topic": "chatgpt",
    "subreddit": "artificial",
    "trendScore": 342.5,
    "velocity": 18.2,
    "engagementRate": 485.3,
    "postCount": 36,
    "commentCount": 820,
    "upvoteCount": 12400
  },
  {
    "topic": "python",
    "subreddit": "programming",
    "trendScore": 198.7,
    "velocity": 9.5,
    "engagementRate": 298.1,
    "postCount": 19,
    "commentCount": 340,
    "upvoteCount": 4200
  }
]
```

---

## ✨ Features

✅ **Automatic Trend Detection**: Scheduled analysis every 30 minutes
✅ **Keyword Extraction**: Intelligent topic extraction from titles
✅ **Weighted Scoring**: Configurable velocity + engagement weights
✅ **Priority Queue**: High-score trends get priority in AI analysis
✅ **Duplicate Handling**: Updates existing trends instead of creating duplicates
✅ **Threshold Filtering**: Only trends above minimum score are saved
✅ **Multi-Subreddit**: Tracks trends across all configured subreddits
✅ **Search & Filter**: Rich API for querying trends
✅ **Manual Triggers**: Admin endpoint for on-demand analysis

---

## 🚀 What Happens Next

Trends are now:
1. ✅ Detected from Reddit data
2. ✅ Scored and ranked
3. ✅ Stored in `trends` table
4. ✅ Published to `ai:analysis:queue`

**AI Processing Service** (Phase 3) will:
- Consume from `ai:analysis:queue`
- Analyze trends with AI (sentiment, insights)
- Publish to `post:generate:queue`

---

## 🎯 Phase 1 MVP Complete!

All core components are now functional:
- ✅ **Auth**: JWT + Reddit OAuth
- ✅ **Ingestion**: Automatic Reddit data fetching
- ✅ **Trend Engine**: Detection, scoring, queue publishing

**Next Phase**: AI Processing & Content Generation
