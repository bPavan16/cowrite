# Authentication API Documentation

This document outlines the authentication endpoints and functionality added to the CoWrite backend.

## Features

- User registration and login
- JWT-based authentication
- Document ownership and permissions
- Collaborative document access control
- Role-based access (user/admin)
- Password validation and security

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "lastLogin": "2025-06-29T12:00:00.000Z"
  }
}
```

### GET /api/auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "lastLogin": "2025-06-29T12:00:00.000Z",
    "createdAt": "2025-06-29T10:00:00.000Z"
  }
}
```

### PUT /api/auth/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "john_smith"
}
```

### PUT /api/auth/change-password
Change user password (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

### POST /api/auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

### GET /api/auth/users
Get all users (admin only).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

## Document Permissions

Documents now support ownership and collaboration:

- **Owner**: Full control (read, write, delete, manage collaborators)
- **Collaborator**: Can read and write (permission level: read/write/admin)
- **Public**: Anyone can read public documents
- **Private**: Only owner and collaborators can access

## Updated Document Endpoints

### GET /api/documents
Get documents based on user permissions:
- Authenticated users see their owned documents, collaborated documents, and public documents
- Unauthenticated users see only public documents

### POST /api/documents
Create a new document (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "My Document",
  "isPublic": false
}
```

### POST /api/documents/:id/collaborators
Add a collaborator to a document (owner only).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "userId": "collaborator_user_id",
  "permission": "write"
}
```

### DELETE /api/documents/:id/collaborators/:userId
Remove a collaborator from a document (owner only).

## Socket.io Authentication

Socket connections now support authentication:

```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

## Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Username Requirements

- 3-20 characters
- Letters, numbers, and underscores only
- Must be unique

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- Permission-based access control
- Error handling and security responses

## Environment Variables

Set these in production:

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

## Backward Compatibility

The system maintains backward compatibility:
- Existing documents without owners remain accessible
- Legacy document operations continue to work
- Socket connections work without authentication

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `500` - Internal Server Error
