# Requirements

## Client
Can:
- Register / Login / Logout
- Reset password (request link)

Cannot yet (planned for later weeks):
- Submit project requests (Week 2)
- Approve mood boards / quotations (Week 3-4)

## Designer
Can:
- Register / Login / Logout
- Reset password (request link)

Cannot yet (planned for later weeks):
- Manage assigned projects (Week 3)
- Create mood boards / quotations (Week 3)

## Admin
Can:
- Register / Login / Logout
- Reset password (request link)

Cannot yet (planned for later weeks):
- Manage users (Week 2)
- View analytics (Week 4)

## Access Control
- Role assigned at registration: `admin`, `designer`, or `client`
- JWT issued on login/register, stored client-side
- Protected routes restrict dashboard access by role (`ProtectedRoute` component)