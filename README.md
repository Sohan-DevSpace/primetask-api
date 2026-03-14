# 🚀 PrimeTask: Premium Full-Stack Management System

Welcome to **PrimeTask**, a high-performance, secure, and visually stunning task management system. This project was developed as part of the **PrimeTrade.ai Backend Developer Internship Assignment**.

PrimeTask demonstrates the integration of a **Scalable REST API** with a **Premium Glassmorphic Frontend**, emphasizing security, modularity, and exceptional user experience.

---

## 🌟 Core Features

### 🔒 Backend (The Brain)
- **JWT Authentication:** Secure user identity management with expiration and role-based payload.
- **Role-Based Access Control (RBAC):** Granular permissions for `Admin` and `User` roles.
- **RESTful Architecture:** Versioned API (`/api/v1`) following industry standards and status codes.
- **Security First:** Implemented **Helmet** (security headers), **CORS**, and **Rate Limiting** (DDOS protection).
- **Data Integrity:** Strict input validation and sanitization using **Zod** schemas.
- **Documentation:** Interactive **Swagger UI** for real-time API exploration.

### 🎨 Frontend (The Experience)
- **Premium UI/UX:** Built with a custom design system featuring **Glassmorphism**, holographic gradients, and modern typography (`Outfit` & `Inter`).
- **Real-time Feedback:** Standardized success/error notifications with intuitive visual cues.
- **Responsive Layout:** Fully optimized for Mobile, Tablet, and Desktop.
- **Micro-interactions:** Smooth transitions and hover animations for an "App-like" feel.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Logic** | Node.js (Express) |
| **UI** | React (Vite) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Style** | Vanilla CSS (Custom Design System) |
| **Icons** | Lucide React |

---

## 🏗️ Scalability & Technical Design Note 

To ensure PrimeTask remains robust as user demand grows, the following architectural strategies are recommended:

### 1. Vertical & Horizontal Scaling
- **Load Balancing:** Deploying multiple instances of the backend behind an Nginx or AWS ALB load balancer.
- **Node.js Clustering:** Utilizing the `cluster` module to leverage multi-core processors on a single server.

### 2. Caching Layer
- **Redis Integration:** Offloading frequent database reads (like user sessions or popular task lists) to an in-memory Redis cache to reduce latency.

### 3. Microservices Transition
- **Decoupling:** As the platform grows, separating the `AuthService` and `TaskService` into independent microservices communicating via **gRPC** or **Message Queues (RabbitMQ/Kafka)**.

### 4. Database Optimization
- **Read Replicas:** Implementing read-only database replicas to handle heavy query loads without stressing the primary write node.
- **Indexing:** Utilizing PostgreSQL B-tree and GiST indexes for rapid search and filtering.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud instance like Neon)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Sohan-DevSpace/primetask-api.git
cd primetask-api

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment Setup
Create a `.env` file in the `/backend` directory:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_strong_secret"
PORT=5000
```

### 4. Database Initialization
```bash
cd backend
npx prisma db push
```

### 5. Start Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 📖 API Documentation
Once the backend is running, access the interactive documentation at:
👉 **[http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs)**

---

## 📧 Submission Contact
**Subject:** <Sohan Mandal> Frontend Developer Task  
**To:** joydip@primetrade.ai, hello@primetrade.ai, chetan@primetrade.ai, sonika@primetrade.ai

