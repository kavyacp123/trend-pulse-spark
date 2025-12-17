# 🚀 Trend Pulse Spark

> **AI-Powered Reddit Trend Analysis & Content Generation Platform**

Automatically discover trending topics on Reddit, analyze them with AI, and generate engaging content - all in one automated pipeline.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue.svg)](https://ai.google.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Pipeline Flow](#-pipeline-flow)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### 🔍 **Automated Trend Detection**
- Fetches posts from multiple subreddits every 15 minutes
- Analyzes velocity, engagement, and trending topics
- Intelligent keyword extraction and scoring

### 🤖 **AI-Powered Analysis (Gemini 1.5 Flash)**
- Sentiment analysis and key insights
- Content suggestions and topic summaries
- **Free tier**: 60 requests/minute

### 📊 **Analytics Dashboard**
- Real-time trend metrics and time-series data
- Engagement analytics by subreddit
- Topic distribution and trending topics over time

### ✍️ **Content Generation**
- AI-generated Reddit posts based on trends
- Draft review system before posting
- Automated posting to Reddit with OAuth

### 🔐 **Secure Authentication**
- JWT-based authentication
- Reddit OAuth 2.0 integration
- Automatic token refresh

### 🛡️ **Production-Ready**
- Circuit breakers and rate limiting
- Redis queue-based async processing
- Comprehensive error handling and logging
- Docker Compose for easy deployment

---

## 🏗️ Architecture

![alt text](<system desgin of trend spark .png>)

**Event-Driven Architecture:**
- Async processing with Redis queues
- Retry logic with Dead Letter Queue (DLQ)
- Scheduled workers for automation

---
## 🔄 Pipeline Flow

### Complete Automated Pipeline

```
1. INGESTION (Every 15 min)
   ├─ Fetch posts from Reddit API
   ├─ Store raw JSON in MinIO
   └─ Log ingestion to database

2. TREND DETECTION (Every 30 min)
   ├─ Read posts from MinIO
   ├─ Extract trending topics (keyword analysis)
   ├─ Calculate metrics (velocity, engagement)
   ├─ Save trends to database
   └─ Publish to ai:analysis:queue

3. AI ANALYSIS (Queue worker, every 30 sec)
   ├─ Consume from ai:analysis:queue
   ├─ Call Gemini API for analysis
   ├─ Save analysis results
   └─ Publish to post:generate:queue

4. POST GENERATION (Queue worker, every 30 sec)
   ├─ Consume from post:generate:queue
   ├─ Call Gemini for content generation
   └─ Save as draft post

5. REDDIT POSTING (Manual/API)
   ├─ Review draft posts
   ├─ Submit to Reddit API
   └─ Track submission status
```

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17+
- **Database**: PostgreSQL 15
- **Cache/Queue**: Redis 7
- **Object Storage**: MinIO (S3-compatible)
- **AI**: Google Gemini 1.5 Flash

### **Infrastructure**
- **Containerization**: Docker & Docker Compose
- **Database Migration**: Flyway
- **Resilience**: Resilience4j (Circuit Breaker, Rate Limiter)
- **Monitoring**: Prometheus, Actuator

### **APIs**
- **Reddit API**: OAuth 2.0, REST
- **Gemini API**: Generative AI

---

## 🚀 Quick Start

### Prerequisites

- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **Docker & Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Reddit App** ([Create here](https://www.reddit.com/prefs/apps))
- **Gemini API Key** ([Get free key](https://makersuite.google.com/app/apikey))

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/trend-pulse-spark.git
cd trend-pulse-spark
```

### 2️⃣ Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO (port 9000, console: 9001)

### 3️⃣ Configure Environment

Create `.env` file in `backend/` directory:

```bash
# Reddit OAuth
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret

# JWT Secret (256-bit)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Database (default values)
DB_URL=jdbc:postgresql://localhost:5432/trendpulse
DB_USERNAME=trendpulse_user
DB_PASSWORD=trendpulse_pass

# Redis
REDIS_HOST=localhost
REDIS_PASSWORD=redis_pass

# MinIO
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
```

### 4️⃣ Build & Run

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 5️⃣ Access Application

- **API**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)

---

## ⚙️ Configuration

### Subreddits to Monitor

Edit `backend/src/main/resources/application.yml`:

```yaml
app:
  ingestion:
    subreddits:
      - technology
      - programming
      - artificial
      - MachineLearning
      - datascience
```

### Trend Detection Sensitivity

```yaml
app:
  trend:
    detection:
      min-score: 50.0          # Minimum trend score
      velocity-weight: 0.4     # Posts per hour weight
      engagement-weight: 0.6   # Comments/upvotes weight
```

### Scheduled Jobs

```yaml
app:
  ingestion:
    schedule:
      cron: "0 */15 * * * *"   # Every 15 minutes
  
  trend:
    analysis:
      schedule:
        cron: "0 */30 * * * *" # Every 30 minutes
```

---

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

#### Reddit OAuth
```http
GET /api/v1/auth/reddit/authorize
```

### Ingestion

#### Trigger Manual Ingestion
```http
POST /api/v1/ingestion/trigger
Authorization: Bearer {jwt-token}
```

#### View Ingestion History
```http
GET /api/v1/ingestion/history?limit=10
Authorization: Bearer {jwt-token}
```

### Trends

#### Get Top Trends
```http
GET /api/v1/trends/top?limit=10
Authorization: Bearer {jwt-token}
```

#### Search Trends
```http
GET /api/v1/trends/search?q=artificial
Authorization: Bearer {jwt-token}
```

#### Get Trends by Subreddit
```http
GET /api/v1/trends/subreddit/technology
Authorization: Bearer {jwt-token}
```

### Analytics

#### Dashboard Overview
```http
GET /api/v1/analytics/overview
Authorization: Bearer {jwt-token}
```

#### Time-Series Data
```http
GET /api/v1/analytics/trends/timeseries?trendId=1&period=week
Authorization: Bearer {jwt-token}
```

#### Engagement Metrics
```http
GET /api/v1/analytics/engagement?subreddit=technology&days=7
Authorization: Bearer {jwt-token}
```

### Reddit Posting

#### Submit Post
```http
POST /api/v1/posts/submit
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "generatedPostId": 1,
  "title": "Trending: AI in 2025",
  "content": "Here's what's happening...",
  "subreddit": "technology"
}
```

#### Check Submission Status
```http
GET /api/v1/posts/status/1
Authorization: Bearer {jwt-token}
```

---

## 👨‍💻 Development

### Running Tests

```bash
mvn test
```

### Database Migrations

```bash
# Create new migration
# Add file: src/main/resources/db/migration/V4__description.sql

# Run migrations
mvn flyway:migrate
```

### View Logs

```bash
# Application logs
tail -f logs/application.log

# Docker logs
docker-compose logs -f
```

### Redis Queue Monitoring

```bash
docker exec -it trendpulse-redis redis-cli -a redis_pass

127.0.0.1:6379> LLEN ai:analysis:queue
127.0.0.1:6379> LLEN post:generate:queue
```

### Database Access

```bash
docker exec -it trendpulse-postgres psql -U trendpulse_user -d trendpulse

# View trends
SELECT topic, subreddit, trend_score FROM trends ORDER BY trend_score DESC LIMIT 10;

# View AI analysis
SELECT * FROM ai_analysis ORDER BY created_at DESC LIMIT 5;
```

---

## 🚢 Deployment

### Production Build

```bash
mvn clean package -DskipTests
```

### Docker Deployment

```bash
# Build image
docker build -f infrastructure/docker/Dockerfile -t trend-pulse-spark:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)

```bash
# Required
REDDIT_CLIENT_ID=xxx
REDDIT_CLIENT_SECRET=xxx
JWT_SECRET=xxx
GEMINI_API_KEY=xxx

# Database
DB_URL=jdbc:postgresql://postgres:5432/trendpulse
DB_USERNAME=xxx
DB_PASSWORD=xxx

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=xxx

# MinIO
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
```

---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
## 🙏 Acknowledgments

- **Google Gemini** for free AI API
- **Reddit** for comprehensive API
- **Spring Boot** for excellent framework
- **Resilience4j** for resilience patterns

---

## 📧 Contact

**Project Maintainer**: kavya patel  
**Email**: kavyapatel038@gmail.com  
**GitHub**: [@yourusername](https://github.com/yourusername)

---


---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ using Spring Boot, Gemini AI, and Reddit API

</div>
