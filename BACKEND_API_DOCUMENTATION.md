# Backend API Documentation for Admin Settings

This document outlines all the backend API endpoints required for the Admin Settings features.

## Base URL
```
http://localhost:4000/api
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 1. Admin Profile Management

### 1.1 Update Admin Username
**Endpoint:** `PUT /api/admin/profile/username`

**Description:** Updates the admin user's display name/username

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body:**
```json
{
  "username": "New Admin Name"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Username updated successfully",
  "data": {
    "username": "New Admin Name",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid username format
- `401 Unauthorized` - Invalid or missing token
- `409 Conflict` - Username already taken
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Validate username (min 3 chars, max 50 chars)
- Check if username is already taken
- Update admin record in database
- Return updated admin data

---

### 1.2 Update Admin Email
**Endpoint:** `PUT /api/admin/profile/email`

**Description:** Updates the admin user's email address

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email updated successfully",
  "data": {
    "email": "newemail@example.com",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format
- `401 Unauthorized` - Invalid or missing token
- `409 Conflict` - Email already in use
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Validate email format
- Check if email is already registered
- Update admin record in database
- Send verification email (optional)
- Update JWT token if email is used for authentication

---

### 1.3 Update Admin Password
**Endpoint:** `PUT /api/admin/profile/password`

**Description:** Changes the admin user's password

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid password format or passwords don't meet requirements
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Current password is incorrect
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Verify current password using bcrypt/argon2
- Validate new password (min 6 chars, complexity requirements)
- Hash new password before storing
- Update admin record in database
- Invalidate old sessions (optional)
- Send password change notification email

---

## 2. Investment Rate Settings

### 2.1 Get Investment Rates
**Endpoint:** `GET /api/admin/settings/investment-rates`

**Description:** Retrieves current investment rate settings

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "rates": {
    "monthlyRate": 2.5,
    "quarterlyRate": 7.5,
    "semiAnnualRate": 15.0,
    "annualRate": 30.0
  },
  "lastUpdated": "2024-01-15T10:30:00Z",
  "updatedBy": "admin@example.com"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Fetch investment rates from settings table
- Return current rates
- Include metadata (last updated, updated by)

---

### 2.2 Update Investment Rates
**Endpoint:** `PUT /api/admin/settings/investment-rates`

**Description:** Updates investment rate settings (requires password verification)

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body:**
```json
{
  "monthlyRate": 2.5,
  "quarterlyRate": 7.5,
  "semiAnnualRate": 15.0,
  "annualRate": 30.0
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Investment rates updated successfully",
  "data": {
    "monthlyRate": 2.5,
    "quarterlyRate": 7.5,
    "semiAnnualRate": 15.0,
    "annualRate": 30.0,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid rate values (must be 0-100)
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Insufficient permissions
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Validate all rates are numbers between 0-100
- Update settings table
- Log the change for audit trail
- Notify relevant systems of rate changes
- Consider versioning for historical tracking

---

## 3. Push Notifications

### 3.1 Send Push Notification
**Endpoint:** `POST /api/notifications/send`

**Description:** Sends push notification to all users or specific users

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body:**
```json
{
  "title": "Important Update",
  "description": "Please check your account for new features",
  "sendToAll": true,
  "userIds": []
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "sentCount": 1523,
  "failedCount": 12,
  "data": {
    "notificationId": "notif_123456",
    "sentAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Validate title and description
- If `sendToAll` is true, fetch all user device tokens
- If `userIds` provided, fetch specific user tokens
- Send notifications via FCM/OneSignal/APNs
- Track sent/failed counts
- Store notification in database for history
- Handle rate limiting
- Queue notifications for large batches

**Push Service Integration Examples:**

**Firebase Cloud Messaging (FCM):**
```javascript
const admin = require('firebase-admin');

async function sendPushNotification(tokens, title, description) {
  const message = {
    notification: {
      title: title,
      body: description
    },
    tokens: tokens
  };
  
  const response = await admin.messaging().sendMulticast(message);
  return {
    sentCount: response.successCount,
    failedCount: response.failureCount
  };
}
```

**OneSignal:**
```javascript
const OneSignal = require('onesignal-node');

async function sendPushNotification(userIds, title, description) {
  const notification = {
    contents: { en: description },
    headings: { en: title },
    include_external_user_ids: userIds
  };
  
  const response = await client.createNotification(notification);
  return response;
}
```

---

### 3.2 Get Notification History
**Endpoint:** `GET /api/notifications/history`

**Description:** Retrieves notification history

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123456",
      "title": "Important Update",
      "description": "Please check your account",
      "sentAt": "2024-01-15T10:30:00Z",
      "sentBy": "admin@example.com",
      "sentCount": 1523,
      "failedCount": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

**Backend Implementation Notes:**
- Fetch notifications from database
- Order by sentAt DESC
- Implement pagination
- Include sender information

---

## 4. Password Reset for Users

### 4.1 Send Password Reset Link
**Endpoint:** `POST /api/admin/users/password-reset`

**Description:** Sends password reset link to a user's email

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent successfully",
  "data": {
    "email": "user@example.com",
    "sentAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

**Backend Implementation Notes:**
- Verify user exists with provided email
- Generate secure reset token (UUID or JWT)
- Store token in database with expiration (24 hours)
- Send email with reset link
- Log the action for audit trail

**Email Template Example:**
```html
Subject: Password Reset Request

Hello,

You are receiving this email because an admin has initiated a password reset for your account.

Click the link below to reset your password:
https://yourapp.com/reset-password?token={resetToken}

This link will expire in 24 hours.

If you did not request this, please contact support immediately.

Best regards,
Your App Team
```

**Reset Token Generation:**
```javascript
const crypto = require('crypto');

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store in database
const resetToken = generateResetToken();
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

await db.passwordResets.create({
  userId: user.id,
  token: resetToken,
  expiresAt: expiresAt,
  used: false
});
```

---

## 5. Database Schema Recommendations

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Investment Rates Settings Table
```sql
CREATE TABLE investment_rates (
  id UUID PRIMARY KEY,
  monthly_rate DECIMAL(5,2) NOT NULL,
  quarterly_rate DECIMAL(5,2) NOT NULL,
  semi_annual_rate DECIMAL(5,2) NOT NULL,
  annual_rate DECIMAL(5,2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID REFERENCES admin_users(id)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_by UUID REFERENCES admin_users(id),
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  send_to_all BOOLEAN DEFAULT true
);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);
```

### Audit Log Table (Recommended)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255),
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. Security Considerations

### Authentication & Authorization
- Verify JWT token on every request
- Check admin role/permissions
- Implement rate limiting (e.g., 100 requests per minute)
- Log all admin actions for audit trail

### Password Security
- Use bcrypt or argon2 for password hashing
- Minimum password requirements: 6 characters (consider increasing to 8+)
- Implement password complexity rules
- Prevent password reuse (store hash history)

### Email Security
- Use verified email service (SendGrid, AWS SES, etc.)
- Implement SPF, DKIM, DMARC records
- Rate limit password reset requests (max 3 per hour per email)
- Use secure reset tokens (cryptographically random)

### API Security
- Implement CORS properly
- Use HTTPS only
- Sanitize all inputs
- Implement request validation
- Add request signing for sensitive operations

---

## 7. Error Handling Standards

All error responses should follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "The provided email address is invalid",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### Common Error Codes
- `INVALID_TOKEN` - Authentication token is invalid or expired
- `INSUFFICIENT_PERMISSIONS` - User doesn't have required permissions
- `INVALID_INPUT` - Request validation failed
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_ENTRY` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## 8. Testing Endpoints

Use tools like Postman, Insomnia, or curl to test:

### Example curl command:
```bash
curl -X PUT http://localhost:4000/api/admin/profile/username \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"username": "New Admin Name"}'
```

### Example with Postman:
1. Set method to PUT/POST/GET
2. Add Authorization header: `Bearer {token}`
3. Add Content-Type header: `application/json`
4. Add request body (for PUT/POST)
5. Send request

---

## 9. Environment Variables

Required environment variables for backend:

```env
# Server
PORT=4000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# Email Service (e.g., SendGrid)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourapp.com

# Push Notifications (FCM)
FCM_SERVER_KEY=your-fcm-server-key
FCM_PROJECT_ID=your-firebase-project-id

# Or OneSignal
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_API_KEY=your-onesignal-api-key

# Frontend URL (for reset links)
FRONTEND_URL=https://yourapp.com

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 10. Implementation Checklist

- [ ] Set up database tables
- [ ] Implement JWT authentication middleware
- [ ] Create admin profile endpoints (username, email, password)
- [ ] Create investment rates endpoints
- [ ] Integrate push notification service (FCM/OneSignal)
- [ ] Create notification endpoints
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Create password reset endpoint
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure CORS
- [ ] Set up HTTPS
- [ ] Deploy to production

---

## Support

For questions or issues with the API implementation, please contact the development team.

**Last Updated:** January 2024
**API Version:** 1.0.0
