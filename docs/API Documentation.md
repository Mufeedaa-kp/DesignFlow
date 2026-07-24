# API Documentation

## Auth

### Register
- **POST** `/api/auth/register`
- Body:

{
  "fullName": "Test Admin",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}

- Response (201):

{
  "success": true,
  "message": "User registered successfully",
  "token": "...",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "admin" }
}


### Login
- **POST** `/api/auth/login`
- Body:

{ "email": "admin@test.com", "password": "123456" }

- Response (200):

{
  "success": true,
  "message": "Login successful",
  "token": "...",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "admin" }
}


### Forgot Password
- **POST** `/api/auth/forgot-password`
- Body:

{ "email": "admin@test.com" }
- Response (200):

{
  "success": true,
  "message": "If that email exists, a reset link has been sent"
}

Week 1, this logs the reset link to the backend console instead of sending a real email. Real email delivery (Resend) is planned for i future.


## Reset Password

- **POST** `/api/auth/reset-password/:token`
- Body:

{ "password": "newpassword123" }

- Response (200):

{ "success": true, "message": "Password reset successful" }

:token is the raw reset token from the console-logged link. Backend hashes it (SHA-256) and compares against the stored hash; also checks a 15-minute expiry window. On success, clears both resetPasswordToken and resetPasswordExpires on the user document.

## Users (Admin only)

### Get All Users
- **GET** `/api/users`
- Headers: `Authorization: Bearer <token>`
- Access: Admin only
- Response (200):

{
  "success": true,
  "count": 3,
  "users": [
    { "_id": "...", "fullName": "...", "email": "...", "role": "client", "status": "active", ... }
  ]
}


### Get User by ID
- **GET** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`
- Access: Admin only


- Note: For Week 1, this logs the reset link to the backend console instead of sending a real email. Real email delivery (Nodemailer) is planned as a later enhancement.

### Planned — Week 2 (designed, not yet implemented)

- POST `/api/project-requests` — Client submits a new request
- GET `/api/project-requests/mine` — Client fetches own requests
- GET `/api/project-requests` — Admin fetches all requests (paginated, filterable by status)
- PATCH `/api/project-requests/:id/approve` — Admin approves + assigns designer; creates linked Project
- PATCH `/api/project-requests/:id/reject` — Admin rejects, optional reason