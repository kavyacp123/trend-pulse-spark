# Auth Package - Implementation Summary

## ✅ What's Been Implemented

### Entities & Repositories

**User Entity** (`User.java`)
- Fields: id, username, email, passwordHash, createdAt, updatedAt, isActive
- JPA lifecycle callbacks for timestamps
- Unique constraints on username and email

**OAuthToken Entity** (`OAuthToken.java`)
- Fields: id, user (FK), provider, accessToken, refreshToken, tokenType, expiresAt, scope
- Many-to-one relationship with User
- `isExpired()` method for token validation
- Auto-updating timestamps

**Repositories:**
- `UserRepository`: findByUsername, findByEmail, existsByUsername, existsByEmail
- `OAuthTokenRepository`: findByUserAndProvider, findByAccessToken, deleteByUser

---

### DTOs

- `LoginRequest`: username, password
- `AuthResponse`: accessToken, refreshToken, tokenType, expiresIn, user (nested UserInfo)
- `RefreshTokenRequest`: refreshToken

---

### Services

**JwtTokenService** (`JwtTokenService.java`)
- Generate access tokens (24 hours)
- Generate refresh tokens (7 days)
- Validate tokens and extract claims
- Extract username and userId from tokens
- Check token expiration
- Uses HMAC-SHA256 signing

**RedditOAuthService** (`RedditOAuthService.java`)
- Generate Reddit authorization URL
- Exchange authorization code for tokens
- Get user info from Reddit API
- Create or find user by Reddit username
- Save/update OAuth tokens
- Refresh expired Reddit tokens
- Get Reddit access token for user

**AuthService** (`AuthService.java`)
- Login with username/password
- Refresh JWT tokens
- Get user by ID or username
- Password validation with BCrypt

---

### Controllers

**AuthController** (`/api/v1/auth`)
- `POST /login` - Username/password authentication
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user info
- `POST /logout` - Logout (client-side)

**OAuthController** (`/api/v1/auth/reddit`)
- `GET /authorize` - Get Reddit OAuth URL
- `GET /callback` - Handle Reddit OAuth callback

---

### Security Configuration

**JwtAuthenticationFilter**
- Intercepts requests with Authorization header
- Extracts and validates JWT tokens
- Sets Spring Security context with user ID
- Runs before UsernamePasswordAuthenticationFilter

**SecurityConfig**
- Stateless session management
- CORS configuration (localhost:3000, localhost:5173)
- Public endpoints: `/api/v1/auth/**`, `/actuator/**`
- Protected endpoints: All others require authentication
- BCrypt password encoder

---

## 🔐 Authentication Flow

### Reddit OAuth Flow

```
1. User → GET /api/v1/auth/reddit/authorize
   ← Returns Reddit authorization URL

2. User redirected to Reddit
   ← User approves app

3. Reddit → GET /api/v1/auth/reddit/callback?code=xxx&state=yyy
   → Exchange code for Reddit tokens
   → Get Reddit user info
   → Create/find User in database
   → Save OAuth tokens
   → Generate JWT tokens
   ← Return JWT access + refresh tokens

4. Client stores JWT tokens
   → All subsequent requests include: Authorization: Bearer <token>
```

### JWT Token Flow

```
1. User → POST /api/v1/auth/login
   Body: { username, password }
   → Validate credentials
   → Generate JWT tokens
   ← Return access + refresh tokens

2. Client → Any protected endpoint
   Header: Authorization: Bearer <access_token>
   → JwtAuthenticationFilter validates token
   → Extract userId and set SecurityContext
   → Controller receives authenticated request

3. Token expires → POST /api/v1/auth/refresh
   Body: { refreshToken }
   → Validate refresh token
   → Generate new access token
   ← Return new access token
```

---

## 🧪 Testing the Auth Package

### 1. Start Infrastructure

```bash
docker-compose up -d
```

### 2. Run Application

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Test Reddit OAuth

```bash
# Get authorization URL
curl http://localhost:8080/api/v1/auth/reddit/authorize

# Response:
{
  "success": true,
  "data": "https://www.reddit.com/api/v1/authorize?client_id=...&redirect_uri=...",
  "timestamp": "2025-12-17T12:30:00Z"
}
```

Visit the URL in browser, approve, and you'll be redirected to callback.

### 4. Test Token Refresh

```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token"}'
```

### 5. Test Protected Endpoint

```bash
curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer your-access-token"
```

---

## 📊 Database Tables Used

**users**
- Stores user accounts (created from Reddit OAuth or manual registration)

**oauth_tokens**
- Stores Reddit OAuth tokens for each user
- Automatically refreshed when expired

---

## 🔧 Configuration Required

Add to `application.yml` or environment variables:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          reddit:
            client-id: ${REDDIT_CLIENT_ID}
            client-secret: ${REDDIT_CLIENT_SECRET}

app:
  jwt:
    secret: ${JWT_SECRET} # 256-bit secret
    expiration: 86400000 # 24 hours
    refresh-expiration: 604800000 # 7 days
```

---

## ✨ Features

✅ **JWT Authentication**: Secure token-based auth with access + refresh tokens
✅ **Reddit OAuth**: Full OAuth 2.0 flow with automatic token refresh
✅ **Password Hashing**: BCrypt for secure password storage
✅ **Token Expiration**: Automatic expiration checking
✅ **CORS Support**: Frontend integration ready
✅ **Stateless**: No server-side sessions
✅ **Spring Security**: Industry-standard security framework

---

## 🚀 Next Steps

The Auth package is complete and production-ready! 

**Ready to implement:**
1. Ingestion Package (Reddit data fetching)
2. Trend Engine Package (Trend detection)

**Auth is now protecting:**
- All API endpoints (except `/api/v1/auth/**` and `/actuator/**`)
- Future endpoints will automatically require JWT authentication
