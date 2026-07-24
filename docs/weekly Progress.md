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
- Frontend: Login, Register, Forgot Password, Reset Password pages
- AuthContext + AuthProvider + useAuth hook
- ProtectedRoute (role-based route guarding)
- Final design system locked: light cream/brown theme (Fraunces serif + Inter sans, Tailwind v4 @theme tokens)
- AuthLayout: split-panel design (brand panel + form panel), used across all 4 auth pages
- NavBar rebuilt: dropdown-based, role-aware nav links, search bar, notification bell (links to /notifications),profile dropdown (Profile / My Projects / Settings / Logout)
- DashboardLayout: light panel navbar + cream content body
- AdminDashboard: stat cards, 2 charts (Monthly Growth, Revenue Analytics), Recent Platform Activity feed
- DesignerDashboard: stat cards, 2 charts (Revenue Overview, Project Status donut), Today's Focus, Upcoming Meetings
- ClientDashboard: stat cards, My Projects (progress bars), Pending Requests

- full flow: register → data appears in MongoDB Compass → login → role-based redirect → logout



### Problems Faced
- TypeScript 7 + verbatimModuleSyntax caused module resolution errors
- Fixed by downgrading to TypeScript 5.7 and using CommonJS module settings
- ESLint react-refresh warning on AuthContext file (mixed exports)
- Fixed by splitting into AuthContext.ts, AuthProvider.tsx, and useAuth.ts hook
- ESLint no-explicit-any warning on catch blocks
- Fixed using catch (err: unknown) + isAxiosError() from axios
- Dashboard charts (Recharts) caused the app to freeze/hang on load in some configurations, traced to ResponsiveContainer/ResizeObserver behavior combined with React 19.
- Resolved by using fixed pixel width/height on chart components directly instead of ResponsiveContainer.



### Next
- Build controllers/routes for ProjectRequest and Project (submit, mine, all, approve, reject)
- Admin: manage users, manage project requests, assign designer
- Client: submit project request, view my requests
- Wire real data into dashboard stat cards (replacing current hardcoded placeholders)

