-- V1.1: Seed Demo User
-- Description: Create a demo user and dummy Reddit token to allow Mock Mode bypass

-- 1. Create Demo User
-- password_hash is null because we will bypass it in AuthController for 'demo' password
INSERT INTO users (username, email, password_hash, is_active, created_at, updated_at)
VALUES ('demo_analyst', 'demo@trendpulse.com', NULL, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- 2. Create Dummy Reddit Token for the demo user
-- This ensures RedditFetchService doesn't crash looking for a user with a token
INSERT INTO oauth_tokens (user_id, provider, access_token, refresh_token, token_type, expires_at, created_at, updated_at)
SELECT id, 'reddit', 'mock_access_token', 'mock_refresh_token', 'bearer', CURRENT_TIMESTAMP + INTERVAL '1 year', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users
WHERE username = 'demo_analyst'
ON CONFLICT DO NOTHING;
