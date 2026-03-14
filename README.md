# PrimeTask — Scalable REST API with Authentication & RBAC

> Built as part of the **PrimeTrade.ai Backend Developer Internship Assignment**

A production-ready full-stack task management system featuring a secure JWT-authenticated REST API, role-based access control, and a premium React frontend.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Security Implementation](#security-implementation)
- [Scalability Design](#scalability-design)

---

## Overview

PrimeTask is a full-stack application demonstrating industry-standard backend engineering practices:

- **JWT Authentication** with secure password hashing (bcrypt)
- **Role-Based Access Control** — `user` and `admin` roles with granular permissions
- **Versioned REST API** at `/api/v1` following HTTP standards
- **Input Validation** using Zod schemas on every endpoint
- **Interactive API Docs** via Swagger UI
- **Premium React Frontend** with full CRUD interface

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Runtime | Node.js + Express v5 | REST API server |
| Frontend | React + Vite | UI layer |
| Database | PostgreSQL | Primary data store |
| ORM | Prisma | Type-safe DB access |
| Auth | JSON Web Tokens + bcryptjs | Authentication |
| Validation | Zod | Input sanitization |
| Security | Helmet + CORS + express-rate-limit | HTTP hardening |
| Logging | Morgan | Request logging |
| Docs | Swagger UI (swagger-jsdoc) | API documentation |

---

## Project Structure

```
PrimeTask/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handler logic
│   │   ├── middlewares/     # Auth, role check, error handler
│   │   ├── routes/v1/       # Versioned API routes
│   │   ├── validators/      # Zod validation schemas
│   │   └── utils/           # JWT helpers, response formatter
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── swagger/             # Swagger spec
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios instance + interceptors
    │   ├── context/         # AuthContext (global state)
    │   ├── components/      # Toast, TaskModal, etc.
    │   └── pages/           # Login, Register, Dashboard
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (local or hosted — [Neon.tech](https://neon.tech) recommended for free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/Sohan-DevSpace/primetask-api.git
cd primetask-api
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-strong-secret-minimum-32-characters"
JWT_EXPIRES_IN="1h"
NODE_ENV="development"
```

> Generate a secure JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Database Initialization

```bash
npx prisma db push
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

### 5. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

Interactive docs: [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs)

### Authentication

| Method | Endpoint | Auth | Description |
| :----- | :------- | :--- | :---------- |
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and receive JWT |

### Tasks

| Method | Endpoint | Auth | Description |
| :----- | :------- | :--- | :---------- |
| GET | `/tasks` | ✅ | Get all tasks (paginated + filtered) |
| POST | `/tasks` | ✅ | Create a new task |
| GET | `/tasks/:id` | ✅ | Get single task |
| PUT | `/tasks/:id` | ✅ | Update a task |
| DELETE | `/tasks/:id` | ✅ | Delete a task |

### Users

| Method | Endpoint | Auth | Role |
| :----- | :------- | :--- | :--- |
| GET | `/users/me` | ✅ | Any |
| GET | `/users` | ✅ | Admin only |

### Using Authentication

```bash
# 1. Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Test@1234"}'

# 2. Login → copy the token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test@1234"}'

# 3. Use token
curl http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer <your-token>"
```

---

## Security Implementation

| Threat | Mitigation |
| :----- | :--------- |
| Brute force | `express-rate-limit` — 20 req/min on auth routes |
| Weak passwords | Zod enforces min 8 chars + complexity rules |
| Plain-text passwords | bcryptjs with 12 salt rounds |
| Insecure HTTP headers | Helmet sets security headers automatically |
| JWT tampering | HS256 signing with env-based secret |
| SQL injection | Prisma ORM parameterized queries |
| Cross-origin abuse | CORS configured for allowed origins only |
| Sensitive data in Git | `.env` in `.gitignore`, `.env.example` provided |

---

## Scalability Design

### Current Architecture

The project is built with horizontal scalability in mind from day one:

- **Stateless JWT** — no server-side sessions; any instance can handle any request
- **Modular structure** — each domain (auth, tasks, users) is an independent module
- **Environment-driven config** — zero hardcoded values, ready for container deployment

### Growth Path

**Stage 1 — Vertical scaling** (current needs)
Add Redis caching for frequent reads (task lists, user profiles), reducing database load.

**Stage 2 — Horizontal scaling** (moderate load)
Deploy multiple backend instances behind an Nginx or AWS ALB load balancer. Node.js cluster module for multi-core utilization.

**Stage 3 — Microservices** (high load)
Extract `AuthService` and `TaskService` into independent deployments communicating via message queues (RabbitMQ or Kafka).

**Stage 4 — Database scaling** (data-intensive)
PostgreSQL read replicas for query separation, B-tree indexes on `user_id` and `status` columns, connection pooling via PgBouncer.

### Docker Support (Optional)

```bash
docker-compose up --build
```

Includes: backend + PostgreSQL + optional Redis containers.

---

## Environment Variables Reference

| Variable | Required | Description |
| :------- | :------- | :---------- |
| `PORT` | ✅ | Server port (default: 5000) |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | ✅ | Token expiry (e.g. `1h`, `7d`) |
| `NODE_ENV` | ✅ | `development` or `production` |

---

*PrimeTask — PrimeTrade.ai Backend Developer Internship Submission*
