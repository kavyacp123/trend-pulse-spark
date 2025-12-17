# Trend Pulse Spark - Backend

A monolithic Spring Boot application for trend processing with Reddit integration, AI analysis, and automated content generation.

## Architecture

- **Event-Driven**: Asynchronous processing using Redis queues
- **Modular Packages**: Clean separation of concerns
- **Production-Ready**: Retry logic, DLQ, monitoring, and health checks

## Tech Stack

- Java 17 + Spring Boot 3.2
- PostgreSQL (analytics database)
- Redis (cache + queue)
- MinIO (S3-compatible object storage)
- Flyway (database migrations)

## Project Structure

```
backend/
├── src/main/java/com/trendpulse/
│   ├── TrendPulseApplication.java
│   ├── auth/              # Authentication & OAuth
│   ├── ingestion/         # Reddit data fetching
│   ├── trendengine/       # Trend detection
│   ├── ai/                # AI analysis
│   ├── postgenerator/     # Content generation
│   ├── redditposting/     # Reddit publishing
│   ├── analytics/         # Dashboard APIs
│   ├── gateway/           # Security filters
│   ├── common/            # Shared utilities
│   ├── queue/             # Redis queue infrastructure
│   └── storage/           # MinIO client
└── src/main/resources/
    ├── application.yml
    └── db/migration/      # Flyway migrations
```

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Docker & Docker Compose

### Run Infrastructure

```bash
# Start PostgreSQL, Redis, MinIO
docker-compose up -d

# Check services
docker-compose ps
```

### Build & Run

```bash
cd backend

# Build
mvn clean install

# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Access Services

- **Application**: http://localhost:8080
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)
- **Actuator Health**: http://localhost:8080/actuator/health
- **Metrics**: http://localhost:8080/actuator/prometheus

## Configuration

### Environment Variables

```bash
# Reddit OAuth
REDDIT_CLIENT_ID=your-client-id
REDDIT_CLIENT_SECRET=your-client-secret

# AI Provider
OPENAI_API_KEY=your-openai-key

# JWT Secret (production)
JWT_SECRET=your-256-bit-secret
```

### Application Profiles

- `dev`: Development with verbose logging
- `prod`: Production optimized

## Database Migrations

Migrations run automatically on startup via Flyway:

- `V1__init_schema.sql`: Users, OAuth, ingestion logs
- `V2__add_analytics_tables.sql`: Trends, metrics, AI analysis
- `V3__add_post_tables.sql`: Generated posts, submissions

## Redis Queues

- `ai:analysis:queue`: Trend Engine → AI Processing
- `post:generate:queue`: AI Processing → Post Generator
- `post:publish:queue`: Post Generator → Reddit Posting

Dead Letter Queues: `{queue}:dlq`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/reddit/authorize`
- `GET /api/v1/auth/reddit/callback`

### Trends
- `GET /api/v1/trends`
- `GET /api/v1/trends/{id}`
- `GET /api/v1/trends/top`

### Analytics
- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/trends/timeseries`

## Development

### Run Tests

```bash
mvn test
```

### Code Style

- Use Lombok for boilerplate reduction
- Follow Spring Boot best practices
- Write meaningful commit messages

## Monitoring

- **Prometheus Metrics**: `/actuator/prometheus`
- **Health Checks**: `/actuator/health`
- **Queue Depth**: Exposed via metrics

## License

MIT
