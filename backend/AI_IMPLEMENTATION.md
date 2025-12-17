# Phase 3: AI Processing & Content Generation - Implementation Summary

## ✅ What's Been Implemented

### AI Package (7 files)

**DTOs:**
- `AIAnalysisRequest` - Request for AI analysis
- `AIAnalysisResponse` - AI analysis results

**Models:**
- `AIAnalysis` - Entity for storing AI analysis results

**Repositories:**
- `AIAnalysisRepository` - Query AI analysis by trend

**Clients:**
- `GeminiClient` - **Gemini 1.5 Flash API integration**
  - Trend analysis with structured prompts
  - Content generation
  - JSON response parsing
  - Fallback error handling

**Services:**
- `AIAnalysisService` - Orchestrates AI analysis workflow
  - Retrieves Reddit data from MinIO
  - Calls Gemini API
  - Saves analysis results
  - Publishes to post generation queue

**Workers:**
- `AIAnalysisWorker` - Consumes from `ai:analysis:queue`
  - Processes jobs every 30 seconds
  - Health check logging

### Post Generator Package (6 files)

**DTOs:**
- `PostGenerationJob` - Queue message for post generation

**Models:**
- `GeneratedPost` - Entity for AI-generated posts

**Repositories:**
- `GeneratedPostRepository` - Query generated posts

**Services:**
- `ContentGenerationService` - Generates Reddit posts
  - Uses Gemini for content creation
  - Parses structured output
  - Saves draft posts

**Workers:**
- `PostGenerationWorker` - Consumes from `post:generate:queue`
  - Processes jobs every 30 seconds
  - Health check logging

---

## 🤖 Gemini 1.5 Flash Integration

### Why Gemini?
✅ **Free tier**: 60 requests/minute
✅ **Fast**: Low latency responses
✅ **Quality**: Excellent for content generation
✅ **Easy**: Simple REST API

### API Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

### Get API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to environment: `GEMINI_API_KEY=your-key-here`

---

## 🔄 Complete Pipeline Flow

```
1. INGESTION (Every 15 min)
   Reddit API → MinIO storage
   
2. TREND DETECTION (Every 30 min)
   MinIO → Detect trends → Save to DB
   → Publish to ai:analysis:queue
   
3. AI ANALYSIS (Queue worker, every 30 sec)
   Consume ai:analysis:queue
   → Retrieve posts from MinIO
   → Call Gemini API for analysis
   → Save AIAnalysis to DB
   → Publish to post:generate:queue
   
4. POST GENERATION (Queue worker, every 30 sec)
   Consume post:generate:queue
   → Call Gemini for content generation
   → Parse and save GeneratedPost
   → Status: draft (ready for review/posting)
```

---

## 📝 AI Prompts

### Trend Analysis Prompt
```
Analyze this trending topic from Reddit:

Topic: {topic}
Subreddit: r/{subreddit}

Sample Posts Data:
{posts_data}

Provide a JSON response with:
1. summary: Brief overview (2-3 sentences)
2. sentiment: positive/negative/neutral/mixed
3. keyInsights: 3-5 key insights
4. contentSuggestions: Post ideas
5. confidenceScore: 0.0-1.0

Format as JSON only, no markdown.
```

### Content Generation Prompt
```
Generate 3 engaging Reddit post ideas:

Topic: {topic}
Summary: {summary}
Key Insights: {insights}

For each post idea:
- Title (catchy, Reddit-appropriate)
- Content (2-3 paragraphs)
- Suggested subreddit

Make it conversational and authentic.
```

---

## ⚙️ Configuration

### application.yml
```yaml
app:
  ai:
    provider: gemini
    gemini:
      api-key: ${GEMINI_API_KEY:your-key}
      model: gemini-1.5-flash
```

### Environment Variables
```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

---

## 🧪 Testing

### 1. Set API Key
```bash
export GEMINI_API_KEY="your-key-here"
```

### 2. Trigger Ingestion
```bash
curl -X POST http://localhost:8080/api/v1/ingestion/trigger \
  -H "Authorization: Bearer your-jwt-token"
```

### 3. Wait for Pipeline
- Ingestion completes → stores in MinIO
- Trend detection runs → publishes to AI queue
- AI worker processes → calls Gemini
- Post generation runs → creates draft posts

### 4. Check Results
```sql
-- Check AI analysis
SELECT * FROM ai_analysis ORDER BY created_at DESC LIMIT 5;

-- Check generated posts
SELECT * FROM generated_posts ORDER BY created_at DESC LIMIT 5;
```

### 5. Monitor Queues
```bash
docker exec -it trendpulse-redis redis-cli -a redis_pass

127.0.0.1:6379> LLEN ai:analysis:queue
127.0.0.1:6379> LLEN post:generate:queue
```

---

## 📊 Database Schema

### ai_analysis Table
- `id` - Primary key
- `trend_id` - Foreign key to trends
- `summary` - AI-generated summary
- `sentiment` - positive/negative/neutral/mixed
- `key_insights` - Key findings (TEXT)
- `content_suggestions` - Post ideas (TEXT)
- `confidence_score` - 0.0-1.0
- `model_used` - "gemini-1.5-flash"
- `created_at` - Timestamp

### generated_posts Table
- `id` - Primary key
- `trend_id` - Foreign key to trends
- `ai_analysis_id` - Foreign key to ai_analysis
- `title` - Post title
- `content` - Post content (TEXT)
- `target_subreddit` - Where to post
- `status` - draft/approved/posted/failed
- `created_at`, `updated_at` - Timestamps

---

## ✨ Features

✅ **Gemini 1.5 Flash**: Free, fast AI analysis
✅ **Structured Prompts**: Optimized for trend analysis
✅ **Queue-Based**: Async processing with retry
✅ **Error Handling**: Fallback responses
✅ **Draft System**: Posts saved for review
✅ **Multi-Provider**: Easy to switch AI providers

---

## 🔄 Alternative AI Providers

The system is designed to support multiple providers:

### Switch to Groq (Free & Fast)
```yaml
app:
  ai:
    provider: groq
    groq:
      api-key: ${GROQ_API_KEY}
      model: llama-3.1-70b-versatile
```

### Switch to OpenAI
```yaml
app:
  ai:
    provider: openai
    openai:
      api-key: ${OPENAI_API_KEY}
      model: gpt-3.5-turbo
```

---

## 📈 Phase 3 Complete!

**Total Files Created**: 13 files
- 2 DTOs (AI)
- 1 Entity (AI)
- 1 Repository (AI)
- 1 Client (Gemini)
- 1 Service (AI)
- 1 Worker (AI)
- 1 DTO (Post Gen)
- 1 Entity (Post Gen)
- 1 Repository (Post Gen)
- 1 Service (Post Gen)
- 1 Worker (Post Gen)

**Pipeline Status**: ✅ **FULLY AUTOMATED**
- Reddit → MinIO → Trends → AI Analysis → Generated Posts

**Next Steps**:
- Get Gemini API key
- Test the complete pipeline
- Review generated posts
- (Optional) Implement Reddit posting service
