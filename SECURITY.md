# Security Implementation Guide

## Overview
The authentication system has been completely redesigned with industry-standard security practices:

### ✅ What's Secure Now

1. **Password Encryption**
   - Uses `bcryptjs` with salt rounds (10) for password hashing
   - Passwords are NEVER stored in plain text
   - One-way hashing - passwords cannot be decrypted

2. **JWT Token Authentication**
   - JSON Web Tokens (JWT) for stateless authentication
   - Tokens expire after 24 hours (configurable)
   - Token verification on every protected request
   - Automatic logout on token expiration

3. **Protected API Routes**
   - POST, PUT, DELETE operations require authentication
   - Middleware checks JWT token validity
   - Admin role verification for sensitive operations
   - Public routes (GET) remain accessible for blog readers

4. **Secure Session Management**
   - Tokens stored in localStorage (can be upgraded to httpOnly cookies)
   - Automatic redirect to login on expired/invalid tokens
   - Clean logout removes all stored credentials

5. **Backend Validation**
   - All authentication logic on server-side
   - Input validation for username/password
   - Password strength requirements
   - Protection against common attacks

## Default Credentials

⚠️ **IMPORTANT**: Change immediately after first login!

```
Username: admin
Password: Admin@2024!
```

## How to Change Password

1. Login to admin dashboard
2. Go to Settings (if implemented) or use the API:

```javascript
POST /api/auth/change-password
Headers: Authorization: Bearer <your-token>
Body: {
  "currentPassword": "Admin@2024!",
  "newPassword": "YourNewStrongPassword123!"
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# Required for production
JWT_SECRET=your-random-64-character-secret-key-here-change-this
JWT_EXPIRES_IN=24h

# Optional
PORT=5000
```

### Generating a Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## API Authentication Flow

### 1. Login
```javascript
POST /api/auth/login
Body: { "username": "admin", "password": "Admin@2024!" }

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "email": "admin@rubyet.info",
    "role": "admin"
  }
}
```

### 2. Protected Request
```javascript
POST /api/posts
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
Body: { ...post data... }
```

### 3. Token Verification
```javascript
GET /api/auth/verify
Headers: { "Authorization": "Bearer <token>" }

Response: { "success": true, "user": {...} }
```

## Protected Routes

The following routes now require authentication:

- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user info

## Security Best Practices

### ✅ Implemented
- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] Protected API routes
- [x] Token expiration
- [x] Secure password requirements
- [x] Authentication middleware
- [x] Role-based access control

### 🔄 Recommended for Production

1. **Use HTTPS**
   - All communication must be over SSL/TLS
   - Prevents man-in-the-middle attacks

2. **Upgrade Token Storage**
   ```javascript
   // Consider httpOnly cookies instead of localStorage
   res.cookie('token', token, {
     httpOnly: true,
     secure: true, // HTTPS only
     sameSite: 'strict',
     maxAge: 24 * 60 * 60 * 1000
   });
   ```

3. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 attempts
     message: 'Too many login attempts, please try again later'
   });
   
   app.use('/api/auth/login', loginLimiter);
   ```

4. **Add CORS Configuration**
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'https://rubyet.info',
     credentials: true
   }));
   ```

5. **Add Request Logging**
   ```bash
   npm install morgan
   ```

6. **Add Helmet for Security Headers**
   ```bash
   npm install helmet
   ```
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

7. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

8. **Monitor Failed Login Attempts**
   - Lock account after multiple failed attempts
   - Send email notifications
   - Log suspicious activity

## Files Changed

### Backend
- `backend/utils/auth.js` - Password hashing and JWT utilities
- `backend/middleware/auth.js` - Authentication middleware
- `backend/controllers/authController.js` - Login/logout logic
- `backend/routes/authRoutes.js` - Authentication routes
- `backend/routes/postRoutes.js` - Added auth protection
- `backend/server.js` - Added auth routes and initialization
- `backend/data/admin.json` - Stores encrypted admin credentials

### Frontend
- `frontend/src/services/authService.jsx` - Backend authentication client
- `frontend/src/services/apiService.js` - JWT token injection
- `frontend/src/contexts/AuthContext.jsx` - Async auth handling
- `frontend/src/pages/AdminLogin.jsx` - Updated login flow

## Testing Authentication

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@2024!"}'
```

### Test Protected Route
```bash
# Get token from login response
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Content","status":"draft"}'
```

### Test Without Token (Should Fail)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test"}'

# Expected: 401 Unauthorized
```

## Troubleshooting

### "Invalid or expired token"
- Token has expired (24 hours by default)
- Solution: Login again to get a new token

### "Access denied. No token provided"
- Request missing Authorization header
- Solution: Add `Authorization: Bearer <token>` header

### "Admin privileges required"
- User doesn't have admin role
- Solution: Check user role in JWT payload

## Migration from Old System

Old authentication data (localStorage/sessionStorage) is incompatible with the new system:
1. Users will need to login again
2. Old sessions will be automatically cleared
3. New JWT tokens will be issued

## Support

For security concerns or vulnerabilities, please contact:
- Email: admin@rubyet.info
- Create a private security issue on GitHub

---

**Last Updated**: October 30, 2025
**Version**: 2.0.0
**Security Level**: Production-Ready with Recommended Enhancements
