# Folder Structure

## Backend


backend/
├── src/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic (auth.controller.ts)
│   ├── middleware/       # auth.middleware.ts, role.middleware.ts
│   ├── models/           # Mongoose schemas (User.model.ts)
│   ├── routes/            # auth.routes.ts
│   ├── validations/       # auth.validation.ts
│   ├── utils/              # generateToken.ts
│   ├── constants/          # roles.ts
│   ├── uploads/            # (for file uploads, Week 2+)
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env

## Frontend

frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/       # LogoutButton, shared small components
│   │   ├── forms/         # Reusable form inputs (future)
│   │   ├── layout/         # DashboardLayout, Navbar, Sidebar
│   │   └── ui/              # Buttons, cards, generic UI pieces
│   ├── pages/
│   │   ├── auth/            # Login, Register, ForgotPassword
│   │   ├── admin/            # Admin dashboard + pages
│   │   ├── designer/          # Designer dashboard + pages
│   │   ├── client/             # Client dashboard + pages
│   │   └── public/              # Landing, About, Contact (Week 4)
│   ├── context/                 # AuthContext.ts, AuthProvider.tsx
│   ├── hooks/                    # useAuth.ts
│   ├── routes/                    # ProtectedRoute.tsx
│   ├── services/                   # api.ts, auth.service.ts
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   └── App.tsx
├── package.json
└── tsconfig.json

