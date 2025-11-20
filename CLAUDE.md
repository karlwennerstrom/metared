# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MetaRed Perfiles UC - A full-stack application for searching and managing IT professional profiles for Universidad Católica de Chile. Features public profile catalog with fuzzy search and admin panel for profile management.

## Development Commands

### Backend (from `/backend`)
```bash
npm run dev          # Run development server with nodemon
npm start            # Run production server
npm run seed         # Import CSV data to database
npm run create-admin # Create superadmin user
```

### Frontend (from `/frontend`)
```bash
npm run dev      # Vite dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

### Docker Operations
```bash
docker-compose up -d                  # Start all services
docker-compose down                   # Stop all services
docker-compose logs -f backend        # Follow backend logs
docker exec -it metared-backend npm run seed  # Run seed inside container
```

## Architecture

### Service Ports
- Backend API: 5000
- Frontend: 3000
- MySQL: 3306

### Backend Structure (`/backend/src/`)
- `config/` - Database and JWT configuration
- `models/` - Sequelize models (Usuario, Perfil)
- `controllers/` - Request handlers (auth, perfiles, usuarios)
- `routes/` - API endpoint definitions
- `middleware/` - Authentication and authorization
- `services/` - Search (Fuse.js) and PDF generation
- `scripts/` - Seed and admin creation utilities

### Frontend Structure (`/frontend/src/`)
- `pages/public/` - HomePage (search), PerfilPage (detail)
- `pages/admin/` - Login, Dashboard, Perfiles CRUD, Usuarios CRUD
- `components/common/` - ProtectedRoute
- `components/admin/` - AdminLayout
- `context/` - AuthContext
- `services/` - API client with axios

### API Structure
RESTful API at `/api/` with JWT Bearer authentication.

**Public endpoints:**
- `GET /api/perfiles` - Search profiles with filters
- `GET /api/perfiles/facets` - Get filter options
- `GET /api/perfiles/:codigo` - Get profile by code
- `GET /api/perfiles/:codigo/pdf` - Download PDF

**Auth endpoints:**
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Admin endpoints (authenticated):**
- `GET/POST /api/admin/perfiles` - List/Create profiles
- `PUT/DELETE /api/admin/perfiles/:id` - Update/Delete profile
- `PATCH /api/admin/perfiles/:id/toggle-publicado` - Toggle publish
- `GET/POST /api/admin/usuarios` - List/Create users
- `PUT/DELETE /api/admin/usuarios/:id` - Update/Delete user

### Database Models

**Usuario:**
- email, password (bcrypt), nombre, rol (editor/admin/superadmin), activo

**Perfil:**
- codigo (unique), nombre, categoria, area_conocimiento, tipo_cargo
- descripcion, responsabilidades, requisitos (TEXT fields)
- publicado (boolean)

## Tech Stack

### Backend
- Node.js 18+, Express.js
- MySQL 8.0 with Sequelize ORM
- JWT authentication with bcryptjs
- Fuse.js for fuzzy search
- PDFKit for PDF generation

### Frontend
- React 18+ with Vite
- Tailwind CSS with UC brand colors
- React Router for navigation
- Axios for API requests
- Lucide React for icons

### UC Brand Colors
- Primary blue: #0176de
- Dark blue: #173f8a
- Yellow: #fec60d

## Key Patterns

**Search Index:** Fuse.js maintains an in-memory index of published profiles. Index is refreshed after any profile CRUD operation.

**Role-Based Access:**
- Editor: Create/edit profiles, toggle publish
- Admin: + Delete profiles, view users
- SuperAdmin: + CRUD users

**Soft Delete for Users:** Users are deactivated (activo=false) rather than deleted.

## Environment Variables

### Backend (`/backend/.env`)
- `PORT` - Server port (5000)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL config
- `JWT_SECRET`, `JWT_EXPIRES_IN` - Authentication

### Frontend (`/frontend/.env`)
- `VITE_API_URL` - Backend API URL (http://localhost:5000/api)

## Development Notes

1. **CSV Import:** Place the CSV file in `/data/` directory and run `npm run seed` to import profiles.

2. **Initial Setup:** Always create a superadmin user first with `npm run create-admin`.

3. **Search Index:** The search index is built on first request and refreshed after profile modifications.

4. **PDF Generation:** Uses PDFKit to generate profile PDFs with UC branding.

5. **Authentication:** JWT tokens stored in localStorage, automatically attached to requests via axios interceptors.
