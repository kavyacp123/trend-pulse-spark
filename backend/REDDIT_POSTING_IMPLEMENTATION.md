# Reddit Posting Service - Implementation Summary

## ✅ What's Been Implemented

### Reddit Posting Package (7 files)

**Models:**
- `PostSubmission` - Entity for tracking Reddit post submissions
  - Fields: id, generatedPostId, redditPostId, redditUrl, subreddit, status, errorMessage
  - Statuses: pending, posted, failed
  - Timestamps: submittedAt, createdAt, updatedAt

**Repositories:**
- `PostSubmissionRepository` - Query submissions by status, subreddit, date

**DTOs:**
- `PostSubmissionRequest` - Request for posting to Reddit
- `PostSubmissionResponse` - Submission status response

**Clients:**
- `RedditPostingClient` - Reddit API integration
  - OAuth token authentication
  - Circuit breaker for resilience
  - Rate limiting (60 req/min)
  - Fallback error handling

**Services:**
- `RedditPublishService` - Orchestrates Reddit posting
  - Submits posts to Reddit
  - Tracks submission status
  - Updates generated post status
  - Error handling and logging

**Controllers:**
- `PostingController` - REST API endpoints
  - `POST /api/v1/posts/submit` - Submit post
  - `GET /api/v1/posts/status/{id}` - Get status
  - `GET /api/v1/posts/submissions` - List submissions

---

## 🔄 Complete End-to-End Pipeline

```
1. INGESTION (Every 15 min)
   Reddit API → Fetch posts → Store in MinIO
   
2. TREND DETECTION (Every 30 min)
   MinIO → Analyze trends → Save to DB
   → Publish to ai:analysis:queue
   
3. AI ANALYSIS (Queue worker, every 30 sec)
   Consume ai:analysis:queue
   → Gemini API analysis
   → Save AIAnalysis
   → Publish to post:generate:queue
   
4. POST GENERATION (Queue worker, every 30 sec)
   Consume post:generate:queue
   → Gemini content generation
   → Save GeneratedPost (status: draft)
   
5. REDDIT POSTING (Manual or automated)
   User reviews draft
   → POST /api/v1/posts/submit
   → Reddit API submission
   → Update status (posted/failed)
```

---

## 📝 API Endpoints

### 1. Submit Post to Reddit
```bash
POST /api/v1/posts/submit
Authorization: Bearer {jwt-token}

Request Body:
{
  "generatedPostId": 1,
  "title": "Trending: AI advancements in 2025",
  "content": "Here's what's happening...",
  "subreddit": "technology",
  "isDraft": false
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "generatedPostId": 1,
    "redditPostId": "abc123",
    "redditUrl": "https://reddit.com/r/technology/comments/abc123/...",
    "subreddit": "technology",
    "status": "posted",
    "submittedAt": "2025-12-17T12:30:00Z"
  }
}
```

### 2. Get Submission Status
```bash
GET /api/v1/posts/status/1
Authorization: Bearer {jwt-token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "status": "posted",
    "redditUrl": "https://reddit.com/r/technology/comments/abc123/..."
  }
}
```

### 3. List Submissions
```bash
GET /api/v1/posts/submissions?status=posted
Authorization: Bearer {jwt-token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "subreddit": "technology",
      "status": "posted",
      "submittedAt": "2025-12-17T12:30:00Z"
    }
  ]
}
```

---

## 🔐 Authentication & Authorization

### Required: Reddit OAuth Token
- User must authenticate with Reddit OAuth
- Token stored in `oauth_tokens` table
- Used for API calls with `Authorization: Bearer {token}`

### Permissions Required:
- `identity` - User identification
- `read` - Read posts
- `submit` - Submit posts

---

## 🛡️ Resilience Features

### Circuit Breaker
- **Name**: `reddit-api`
- **Sliding window**: 10 requests
- **Failure threshold**: 50%
- **Wait duration**: 10 seconds
- **Fallback**: Returns error status

### Rate Limiting
- **Limit**: 60 requests per minute
- **Refresh period**: 60 seconds
- **Timeout**: 5 seconds

### Error Handling
- API errors captured in `error_message`
- Status updated to `failed`
- Retry logic can be implemented

---

## 📊 Database Schema

### post_submissions Table
```sql
CREATE TABLE post_submissions (
    id BIGSERIAL PRIMARY KEY,
    generated_post_id BIGINT NOT NULL,
    reddit_post_id VARCHAR(100),
    reddit_url VARCHAR(500),
    subreddit VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

**Indexes:**
- `idx_submissions_post_id` on `generated_post_id`
- `idx_submissions_status` on `status`
- `idx_submissions_submitted_at` on `submitted_at`

---

## 🧪 Testing

### 1. Generate a Post (via pipeline)
Wait for AI analysis and post generation to complete.

### 2. Review Draft Posts
```sql
SELECT * FROM generated_posts WHERE status = 'draft';
```

### 3. Submit to Reddit
```bash
curl -X POST http://localhost:8080/api/v1/posts/submit \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "generatedPostId": 1,
    "title": "Trending: AI in 2025",
    "content": "Here is what is happening...",
    "subreddit": "technology"
  }'
```

### 4. Check Submission Status
```bash
curl http://localhost:8080/api/v1/posts/status/1 \
  -H "Authorization: Bearer your-jwt-token"
```

### 5. Verify on Reddit
Visit the `redditUrl` from the response to see your post live!

---

## ⚠️ Important Notes

### Manual Review Recommended
- Posts are generated as **drafts** by default
- Review content before submitting to Reddit
- Ensure compliance with subreddit rules

### Reddit API Limits
- 60 requests per minute
- Posting limits vary by subreddit
- New accounts may have restrictions

### Error Scenarios
- **OAuth token expired**: Refresh token automatically
- **Subreddit rules**: Check rules before posting
- **Rate limit**: Wait and retry
- **API down**: Circuit breaker activates

---

## ✨ Features

✅ **OAuth Authentication**: Secure Reddit API access
✅ **Circuit Breaker**: Resilient API calls
✅ **Rate Limiting**: Respects Reddit limits
✅ **Status Tracking**: Complete submission history
✅ **Error Handling**: Detailed error messages
✅ **Draft System**: Review before posting

---

## 🎉 Complete Pipeline Implemented!

**All Phases Complete:**
- ✅ Phase 1: Auth, Ingestion, Trend Engine
- ✅ Phase 2: Analytics Dashboard
- ✅ Phase 3: AI Processing (Gemini)
- ✅ Phase 4: Reddit Posting

**Total Files Created**: ~100+ files
**Fully Automated Pipeline**: Reddit → Trends → AI → Posts → Reddit

**Ready for production deployment!** 🚀
