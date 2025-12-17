-- V2: Analytics Tables
-- Description: Create tables for trends, metrics, and analytics data

-- Trends table
CREATE TABLE trends (
    id BIGSERIAL PRIMARY KEY,
    topic VARCHAR(500) NOT NULL,
    subreddit VARCHAR(255) NOT NULL,
    trend_score DECIMAL(10, 4) NOT NULL DEFAULT 0.0,
    velocity DECIMAL(10, 4) NOT NULL DEFAULT 0.0,
    engagement_rate DECIMAL(10, 4) NOT NULL DEFAULT 0.0,
    post_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    upvote_count INTEGER NOT NULL DEFAULT 0,
    raw_data_path TEXT,
    detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'active'
);

CREATE INDEX idx_trends_topic ON trends(topic);
CREATE INDEX idx_trends_subreddit ON trends(subreddit);
CREATE INDEX idx_trends_trend_score ON trends(trend_score DESC);
CREATE INDEX idx_trends_detected_at ON trends(detected_at DESC);
CREATE INDEX idx_trends_status ON trends(status);

-- Trend metrics (time-series data)
CREATE TABLE trend_metrics (
    id BIGSERIAL PRIMARY KEY,
    trend_id BIGINT NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10, 4) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trend_metrics_trend_id ON trend_metrics(trend_id);
CREATE INDEX idx_trend_metrics_recorded_at ON trend_metrics(recorded_at DESC);
CREATE INDEX idx_trend_metrics_type ON trend_metrics(metric_type);

-- Daily aggregated metrics
CREATE TABLE daily_trend_metrics (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    subreddit VARCHAR(255),
    total_trends INTEGER NOT NULL DEFAULT 0,
    avg_trend_score DECIMAL(10, 4) NOT NULL DEFAULT 0.0,
    total_posts INTEGER NOT NULL DEFAULT 0,
    total_engagement INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_daily_metrics_date_subreddit ON daily_trend_metrics(date, subreddit);
CREATE INDEX idx_daily_metrics_date ON daily_trend_metrics(date DESC);

-- Topic distribution
CREATE TABLE topic_distribution (
    id BIGSERIAL PRIMARY KEY,
    topic VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_topic_distribution_topic ON topic_distribution(topic);
CREATE INDEX idx_topic_distribution_category ON topic_distribution(category);
CREATE INDEX idx_topic_distribution_count ON topic_distribution(occurrence_count DESC);

-- AI analysis results
CREATE TABLE ai_analysis (
    id BIGSERIAL PRIMARY KEY,
    trend_id BIGINT NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(5, 4),
    key_topics JSONB,
    summary TEXT,
    insights JSONB,
    analyzed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_analysis_trend_id ON ai_analysis(trend_id);
CREATE INDEX idx_ai_analysis_sentiment ON ai_analysis(sentiment);
CREATE INDEX idx_ai_analysis_analyzed_at ON ai_analysis(analyzed_at DESC);

-- Materialized view for dashboard
CREATE MATERIALIZED VIEW dashboard_overview AS
SELECT 
    COUNT(DISTINCT t.id) as total_trends,
    COUNT(DISTINCT t.subreddit) as total_subreddits,
    AVG(t.trend_score) as avg_trend_score,
    SUM(t.post_count) as total_posts,
    SUM(t.upvote_count) as total_upvotes,
    MAX(t.detected_at) as last_trend_detected
FROM trends t
WHERE t.status = 'active'
AND t.detected_at >= CURRENT_DATE - INTERVAL '7 days';

CREATE UNIQUE INDEX idx_dashboard_overview ON dashboard_overview (total_trends);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_overview()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_overview;
END;
$$ LANGUAGE plpgsql;
