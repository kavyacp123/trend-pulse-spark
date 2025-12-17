# Ingestion Package - Implementation Summary

## ✅ What's Been Implemented

### Models

**RedditPost** (`RedditPost.java`)
- Complete Reddit post data model with all fields
- Fields: id, title, selftext, author, subreddit, permalink, url
- Metrics: score, numComments, ups, downs, upvoteRatio
- Metadata: createdUtc, isVideo, isSelf, over18, spoiler, thumbnail, domain
- `calculateEngagement()` method for scoring

**IngestionLog** (`IngestionLog.java`)
- JPA entity for tracking ingestion operations
- Fields: id, source, subreddit, postsFetched, storagePath, status, errorMessage
- Timestamps: startedAt, completedAt
- Helper methods: `markCompleted()`, `markFailed()`

### Repository

**IngestionLogRepository**
- Query methods for tracking history
- Find by subreddit, status, date range
- Count by status

### DTOs

**IngestionStatusResponse**
- API response with ingestion details
- Includes duration calculation

### Client

**RedditApiClient** (`RedditApiClient.java`)
- WebClient-based Reddit API integration
- Methods: `fetchHotPosts()`, `fetchNewPosts()`
- Circuit breaker pattern with Resilience4j
- Rate limiting (60 requests/minute)
- Automatic OAuth token handling
- JSON parsing from Reddit API response
- Fallback method for failures

### Services

**ObjectStorageService** (`ObjectStorageService.java`)
- Store Reddit posts as JSON in MinIO
- Object key format: `reddit/{subreddit}/{timestamp}.json`
- Retrieve posts from storage
- Uses Jackson ObjectMapper for JSON serialization

**RedditFetchService** (`RedditFetchService.java`)
- Orchestrates the entire ingestion process
- Fetches posts from Reddit API
- Stores in MinIO
- Creates and updates ingestion logs
- Supports single and batch subreddit fetching
- Transaction management

### Worker

**ScheduledIngestionWorker** (`ScheduledIngestionWorker.java`)
- Automatic scheduled ingestion
- Cron-based execution (every 15 minutes by default)
- Fetches from configured subreddits
- Logs success/failure statistics
- Health check logging (every 5 minutes)

### Controller

**IngestionController** (`/api/v1/ingestion`)
- `POST /trigger?subreddit={name}` - Manual trigger for single subreddit
- `POST /trigger/batch` - Batch trigger for multiple subreddits
- `GET /status/{id}` - Get ingestion status by ID
- `GET /history?limit={n}` - Get ingestion history

---

## 🔄 Data Flow

```
1. Scheduled Worker (every 15 min)
   ↓
2. RedditFetchService.fetchFromSubreddits()
   ↓
3. For each subreddit:
   a. Create IngestionLog (status: running)
   b. RedditApiClient.fetchHotPosts()
      - Get OAuth token from RedditOAuthService
      - Call Reddit API with circuit breaker
      - Parse JSON response
   c. ObjectStorageService.storeRedditPosts()
      - Convert to JSON
      - Upload to MinIO (bucket: trendpulse-raw-data)
      - Path: reddit/{subreddit}/{timestamp}.json
   d. Update IngestionLog (status: completed)
   ↓
4. Raw data ready for Trend Engine
```

---

## 🧪 Testing the Ingestion Package

### 1. Prerequisites

Make sure you have:
- ✅ Docker Compose running (PostgreSQL, Redis, MinIO)
- ✅ Reddit OAuth configured (user authenticated)
- ✅ Application running

### 2. Manual Trigger

```bash
# Trigger ingestion for a single subreddit
curl -X POST "http://localhost:8080/api/v1/ingestion/trigger?subreddit=technology" \
  -H "Authorization: Bearer your-jwt-token"

# Response:
{
  "success": true,
  "message": "Ingestion completed for r/technology",
  "data": {
    "id": 1,
    "source": "reddit",
    "subreddit": "technology",
    "postsFetched": 100,
    "status": "completed",
    "storagePath": "reddit/technology/2025-12-17T12-30-00Z.json",
    "startedAt": "2025-12-17T12:30:00Z",
    "completedAt": "2025-12-17T12:30:05Z",
    "durationMs": 5000
  }
}
```

### 3. Batch Trigger

```bash
curl -X POST http://localhost:8080/api/v1/ingestion/trigger/batch \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '["technology", "programming", "artificial"]'
```

### 4. View History

```bash
curl http://localhost:8080/api/v1/ingestion/history?limit=10 \
  -H "Authorization: Bearer your-jwt-token"
```

### 5. Check MinIO

1. Open http://localhost:9001
2. Login: minioadmin / minioadmin123
3. Navigate to bucket: `trendpulse-raw-data`
4. See files: `reddit/technology/2025-12-17T12-30-00Z.json`

### 6. Verify Database

```sql
SELECT * FROM ingestion_logs ORDER BY started_at DESC LIMIT 10;
```

---

## ⚙️ Configuration

### Subreddits to Monitor

In `application.yml`:

```yaml
app:
  ingestion:
    subreddits:
      - technology
      - programming
      - artificial
      - MachineLearning
    posts-per-fetch: 100
    schedule:
      cron: "0 */15 * * * *"  # Every 15 minutes
```

### Circuit Breaker Settings

```yaml
resilience4j:
  circuitbreaker:
    instances:
      reddit-api:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10000
```

### Rate Limiting

```yaml
resilience4j:
  ratelimiter:
    instances:
      reddit-api:
        limit-for-period: 60
        limit-refresh-period: 60s
```

---

## 📊 Stored Data Format

### MinIO Object Structure

```
trendpulse-raw-data/
└── reddit/
    ├── technology/
    │   ├── 2025-12-17T12-00-00Z.json
    │   ├── 2025-12-17T12-15-00Z.json
    │   └── 2025-12-17T12-30-00Z.json
    ├── programming/
    │   └── ...
    └── artificial/
        └── ...
```

### JSON File Content

```json
[
  {
    "id": "abc123",
    "title": "New AI breakthrough announced",
    "selftext": "Researchers have...",
    "author": "username",
    "subreddit": "technology",
    "permalink": "/r/technology/comments/abc123/...",
    "url": "https://...",
    "score": 5420,
    "numComments": 342,
    "ups": 5420,
    "downs": 0,
    "upvoteRatio": 0.95,
    "createdUtc": "2025-12-17T12:00:00Z",
    "isVideo": false,
    "isSelf": true,
    "over18": false,
    "spoiler": false,
    "thumbnail": "self",
    "domain": "self.technology"
  },
  ...
]
```

---

## ✨ Features

✅ **Automatic Scheduling**: Cron-based ingestion every 15 minutes
✅ **Circuit Breaker**: Protects against Reddit API failures
✅ **Rate Limiting**: Respects Reddit's 60 requests/minute limit
✅ **OAuth Integration**: Automatic token refresh
✅ **Object Storage**: Immutable raw data in MinIO
✅ **Audit Trail**: Complete ingestion history in database
✅ **Manual Triggers**: API endpoints for on-demand fetching
✅ **Batch Processing**: Fetch from multiple subreddits
✅ **Error Handling**: Graceful failures with detailed logging

---

## 🚀 Next Steps

The Ingestion package is complete! Raw Reddit data is now being:
1. ✅ Fetched automatically every 15 minutes
2. ✅ Stored in MinIO as JSON files
3. ✅ Tracked in `ingestion_logs` table

**Ready for Trend Engine:**
- Trend Engine will read from MinIO
- Analyze posts for trending topics
- Compute metrics (velocity, engagement)
- Publish to `ai:analysis:queue`
