-- V3: Generated Posts and Publishing Tables
-- Description: Create tables for AI-generated posts and Reddit publishing

-- Generated posts table
CREATE TABLE generated_posts (
    id BIGSERIAL PRIMARY KEY,
    trend_id BIGINT NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
    ai_analysis_id BIGINT REFERENCES ai_analysis(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    target_subreddit VARCHAR(255) NOT NULL,
    post_type VARCHAR(50) NOT NULL DEFAULT 'text',
    template_used VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_generated_posts_trend_id ON generated_posts(trend_id);
CREATE INDEX idx_generated_posts_status ON generated_posts(status);
CREATE INDEX idx_generated_posts_created_at ON generated_posts(created_at DESC);

-- Post submissions (tracking Reddit posts)
CREATE TABLE post_submissions (
    id BIGSERIAL PRIMARY KEY,
    generated_post_id BIGINT NOT NULL REFERENCES generated_posts(id) ON DELETE CASCADE,
    reddit_post_id VARCHAR(255) UNIQUE,
    reddit_permalink TEXT,
    subreddit VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    error_message TEXT,
    submitted_at TIMESTAMP,
    last_checked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_submissions_generated_post_id ON post_submissions(generated_post_id);
CREATE INDEX idx_post_submissions_status ON post_submissions(status);
CREATE INDEX idx_post_submissions_reddit_post_id ON post_submissions(reddit_post_id);
CREATE INDEX idx_post_submissions_submitted_at ON post_submissions(submitted_at DESC);

-- Post templates
CREATE TABLE post_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    title_template TEXT NOT NULL,
    content_template TEXT NOT NULL,
    post_type VARCHAR(50) NOT NULL DEFAULT 'text',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_templates_name ON post_templates(name);
CREATE INDEX idx_post_templates_is_active ON post_templates(is_active);

-- Trigger for updated_at on generated_posts
CREATE TRIGGER update_generated_posts_updated_at BEFORE UPDATE ON generated_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on post_templates
CREATE TRIGGER update_post_templates_updated_at BEFORE UPDATE ON post_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO post_templates (name, description, title_template, content_template, post_type) VALUES
('trending_topic', 'Default template for trending topics', 
 'Trending Now: {{topic}}', 
 'Hey everyone! I''ve noticed {{topic}} is gaining a lot of traction lately.\n\n{{summary}}\n\nWhat are your thoughts on this trend?',
 'text'),
('analysis_summary', 'Template for AI analysis summaries',
 '{{topic}} - Analysis and Insights',
 'I analyzed the recent discussions about {{topic}}.\n\n**Key Findings:**\n{{insights}}\n\n**Sentiment:** {{sentiment}}\n\nWhat do you think?',
 'text');
