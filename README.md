# MetaRed Perfiles UC

Sistema de búsqueda y administración de perfiles profesionales del área de TI para la Universidad Católica de Chile.

## Características

### Módulo Público
- Búsqueda inteligente con tolerancia a errores tipográficos (Fuse.js)
- Filtros dinámicos por Categoría, Área y Tipo de Cargo
- Vista detallada de cada perfil
- Exportación a PDF
- Diseño responsive

### Módulo de Administración
- Login seguro con JWT
- Dashboard con estadísticas
- CRUD completo de perfiles
- Sistema de roles (Editor, Admin, SuperAdmin)
- Gestión de usuarios

## Stack Tecnológico

- **Backend:** Node.js + Express + MySQL + Sequelize
- **Frontend:** React + Tailwind CSS + React Router
- **Búsqueda:** Fuse.js (fuzzy search)
- **PDFs:** PDFKit
- **Auth:** JWT + bcrypt
- **DevOps:** Docker + Docker Compose

## Requisitos

- Docker & Docker Compose
- Git
- Node.js 18+ (opcional, para desarrollo sin Docker)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd metared
```

### 2. Preparar datos iniciales

```bash
mkdir -p data
# Copiar el CSV de perfiles a data/
cp MetaRed_Perfiles_TI__250301_ORIGINAL_UNIFICADO_xlsx_-_TODOS.csv data/
```

### 3. Levantar servicios

```bash
docker-compose up -d
```

Esto iniciará:
- `metared-mysql`: Base de datos MySQL (puerto 3306)
- `metared-backend`: API REST (puerto 5000)
- `metared-frontend`: Interfaz web (puerto 3000)

### 4. Crear usuario Super Admin

```bash
docker exec -it metared-backend npm run create-admin -- \
  --email=admin@uc.cl \
  --password=Admin123! \
  --nombre="Super Admin"
```

### 5. Importar perfiles desde CSV

```bash
docker exec -it metared-backend npm run seed
```

### 6. Acceder a la aplicación

- **Frontend Público:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **API Backend:** http://localhost:5000/api

**Credenciales iniciales:**
- Email: `admin@uc.cl`
- Password: `Admin123!`

## Estructura del Proyecto

```
metared/
├── backend/                 # API REST Node.js
│   ├── src/
│   │   ├── config/         # DB, JWT
│   │   ├── models/         # Sequelize models
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Endpoints
│   │   ├── middleware/     # Auth, roles
│   │   ├── services/       # Búsqueda, PDF
│   │   └── scripts/        # Seed, create-admin
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # Interfaz React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas públicas y admin
│   │   ├── context/        # Auth context
│   │   └── services/       # API calls
│   ├── Dockerfile
│   └── package.json
│
├── data/                    # CSV de perfiles
├── docker-compose.yml       # Orquestación
└── README.md
```

## Sistema de Roles

| Rol | Permisos |
|-----|----------|
| **Editor** | Ver, crear y editar perfiles. Toggle publicado/borrador. |
| **Admin** | Todo lo de Editor + Eliminar perfiles + Ver usuarios |
| **SuperAdmin** | Todo lo de Admin + Crear/editar/eliminar usuarios |

## API Endpoints

### Públicos
- `GET /api/perfiles` - Buscar perfiles
- `GET /api/perfiles/facets` - Obtener filtros disponibles
- `GET /api/perfiles/:codigo` - Detalle de perfil
- `GET /api/perfiles/:codigo/pdf` - Descargar PDF

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Admin (requiere autenticación)
- `GET /api/admin/perfiles` - Listar todos los perfiles
- `POST /api/admin/perfiles` - Crear perfil
- `PUT /api/admin/perfiles/:id` - Actualizar perfil
- `DELETE /api/admin/perfiles/:id` - Eliminar perfil
- `PATCH /api/admin/perfiles/:id/toggle-publicado` - Cambiar estado
- `GET /api/admin/usuarios` - Listar usuarios
- `POST /api/admin/usuarios` - Crear usuario
- `PUT /api/admin/usuarios/:id` - Actualizar usuario
- `DELETE /api/admin/usuarios/:id` - Desactivar usuario

## Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo (con nodemon)
npm start            # Producción
npm run create-admin # Crear superadmin
npm run seed         # Importar CSV
```

### Frontend

```bash
npm run dev      # Desarrollo (con HMR)
npm run build    # Build para producción
npm run preview  # Preview build
```

## Troubleshooting

### MySQL no arranca

```bash
docker-compose down -v
docker-compose up -d
```

### Backend no conecta a MySQL

Verificar que el healthcheck de MySQL esté OK:
```bash
docker-compose ps
# mysql debe estar "healthy"
```

### Limpiar todo y empezar de cero

```bash
docker-compose down -v
docker system prune -a
rm -rf backend/node_modules frontend/node_modules
docker-compose up -d --build
```

## Deployment a Producción

1. Cambiar variables de entorno:
   - `NODE_ENV=production`
   - `JWT_SECRET=<secret-seguro-aleatorio>`
   - Usar contraseñas fuertes para MySQL

2. Build de producción:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

3. Configurar nginx como reverse proxy

4. SSL/TLS con Let's Encrypt

## Licencia

© 2025 Universidad Católica de Chile
