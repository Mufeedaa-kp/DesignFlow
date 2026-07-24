# Requirements

## Client
Can:
- Register / Login / Logout
- Reset password (request link + set new password)
- View dashboard (placeholder data: pending requests, active projects, upcoming meetings)

Cannot yet (planned for later weeks):
- Submit project requests 
- Approve mood boards / quotations 

## Designer
Can:
- Register / Login / Logout
- Reset password (request link + set new password)
- View dashboard (placeholder data: active projects, revenue, tasks, client rating, today's focus, upcoming meetings)

Cannot yet (planned for later weeks):
- Manage assigned projects 
- Create mood boards / quotations

## Admin
Can:
- Register / Login / Logout
- Reset password (request link + set new password)
- View dashboard (placeholder data: total users, active designers, total projects, platform revenue, recent activity)

Cannot yet (planned for later weeks):
- Manage users 
- View analytics 

## Access Control
- Role assigned at registration: `admin`, `designer`, or `client`
- JWT issued on login/register, stored client-side
- Protected routes restrict dashboard access by role (`ProtectedRoute` component)
- Nav links, dashboard content, and role-specific routes are all role-aware via user.role

## To Do -
- Real email sending (currently console-log stub)
- Google OAuth login/register
- Email OTP verification at registration