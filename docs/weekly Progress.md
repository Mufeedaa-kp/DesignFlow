# Weekly Progress

## Week 1

### Completed
- Project planning, Trello board, GitHub repo
- Folder structure (frontend + backend)
- MongoDB connection (local)
- User model (Mongoose + TypeScript)
- Register API + Login API
- JWT authentication + role middleware
- Postman testing (register/login verified)

### In Progress
- Frontend auth pages (Login, Register)
- Auth Context + Protected Routes

### Problems Faced
- TypeScript 7 + verbatimModuleSyntax caused module resolution errors
- Fixed by downgrading to TypeScript 5.7 and using CommonJS module settings

### Next
- Finish frontend auth UI
- Push Week 1 to GitHub


# Weekly Progress

## Week 1 — COMPLETE ✅

### Completed
- Project planning, Trello board, GitHub repo
- Folder structure (frontend + backend)
- MongoDB connection (local, verified in Compass)
- User model (Mongoose + TypeScript)
- Register API, Login API, Forgot Password API (stub)
- JWT authentication + role-based middleware
- Postman testing (register/login verified)
- Frontend: Login, Register, Forgot Password pages
- AuthContext + AuthProvider + useAuth hook
- ProtectedRoute (role-based route guarding)
- DashboardLayout with Logout button
- Verified full flow: register → data appears in MongoDB Compass → login → role-based redirect → logout

### Problems Faced
- TypeScript 7 + verbatimModuleSyntax caused module resolution errors on imports
  - Fixed by downgrading to TypeScript 5.7.3 and using CommonJS module settings
- ESLint react-refresh warning on AuthContext file (mixed exports)
  - Fixed by splitting into AuthContext.ts, AuthProvider.tsx, and useAuth.ts hook
- ESLint no-explicit-any warning on catch blocks
  - Fixed using `catch (err: unknown)` + `isAxiosError()` from axios

### Next (Week 2)
- Database schema: ProjectRequest, Project
- Admin: manage users, manage project requests, assign designer
- Client: submit project request, view my requests