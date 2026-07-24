# Folder Structure

## Backend

backend/
├── src/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic (auth.controller.ts, user.controller.ts)
│   ├── middleware/       # auth.middleware.ts, role.middleware.ts
│   ├── models/           # Mongoose schemas (User.model.ts; Week 2: ProjectRequest, Project)
│   ├── routes/            # auth.routes.ts, user.routes.ts, test.routes.ts
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

backend/
├── src/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic (auth.controller.ts, user.controller.ts)
│   ├── middleware/       # auth.middleware.ts, role.middleware.ts
│   ├── models/           # Mongoose schemas (User.model.ts; Week 2: ProjectRequest, Project)
│   ├── routes/            # auth.routes.ts, user.routes.ts, test.routes.ts
│   ├── validations/       # auth.validation.ts
│   ├── utils/              # generateToken.ts
│   ├── constants/          # roles.ts
│   ├── uploads/            # (for file uploads, Week 2+)
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env