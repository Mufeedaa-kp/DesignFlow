# API Documentation

## Auth

### Register
- **POST** `/api/auth/register`
- Body:
```json
{
  "fullName": "Test Admin",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```
- Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "...",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "admin" }
}
```

### Login
- **POST** `/api/auth/login`
- Body:
```json
{ "email": "admin@test.com", "password": "123456" }
```
- Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "...",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "admin" }
}
```

### Forgot Password
- **POST** `/api/auth/forgot-password`
- Body:
```json
{ "email": "admin@test.com" }
```
- Response (200):
```json
{
  "success": true,
  "message": "If that email exists, a reset link has been sent"
}
```

## Users (Admin only)

### Get All Users
- **GET** `/api/users`
- Headers: `Authorization: Bearer <token>`
- Access: Admin only
- Response (200):
```json
{
  "success": true,
  "count": 3,
  "users": [
    { "_id": "...", "fullName": "...", "email": "...", "role": "client", "status": "active", ... }
  ]
}
```

### Get User by ID
- **GET** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`
- Access: Admin only


- Note: For Week 1, this logs the reset link to the backend console instead of sending a real email. Real email delivery (Nodemailer) is planned as a later enhancement.