# 💅 SalemBeauty App

Beauty salon booking & management platform.

## 🏗️ Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend:** React / Next.js, TailwindCSS (Phase 2)
- **Auth:** JWT + Passport.js
- **Docs:** Swagger / OpenAPI

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### 1. Start Database

```bash
docker-compose up -d postgres
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

### 3. Access

- **API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **pgAdmin:** http://localhost:5050

## 📁 Project Structure

```
salembeauty-app/
├── backend/          # NestJS API server
├── frontend/         # Next.js app (Phase 2)
├── docker-compose.yml
└── README.md
```

## 📄 License

Private — All rights reserved.
