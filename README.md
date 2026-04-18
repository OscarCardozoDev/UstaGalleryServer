
# 🎨 UstaGalleryServer

**Backend API para Plataforma de Gestión de Galería de Arte**

Una solución empresarial robusta y segura diseñada para el grupo de arte de la Universidad Santo Tomás (Tunja).

---

## 📑 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Autenticación y Permisos](#autenticación-y-permisos)
6. [Documentación de Endpoints](#documentación-de-endpoints)
7. [Seguridad](#seguridad)

---

## 🎯 Descripción General

**UstaGalleryServer** es el backend de una plataforma web para el grupo de arte de la Universidad Santo Tomás. Proporciona:

- ✅ Gestión segura de usuarios con roles diferenciados
- ✅ Sistema de autenticación con JWT
- ✅ Gestión de fotografías y galería de obras
- ✅ Catálogo de estilos artísticos
- ✅ Administración de grupos de trabajo
- ✅ Sistema de aprobación de obras

**Stack:** TypeScript, Bun, Docker, PostgreSQL

---

## 📋 Requisitos Previos

- **Bun** v1.0+
- **PostgreSQL** v12+
- **Docker** (opcional)

---

## 🚀 Instalación

```bash
git clone https://github.com/OscarCardozoDev/UstaGalleryServer.git
cd UstaGalleryServer
bun install
bun run build
bun start
```

## 🔐 Autenticación y Permisos

### Roles

| Rol | Acceso |
|-----|--------|
| **ADMIN** | Completo |
| **PROFESOR** | Gestión y aprobación |
| **ESTUDIANTE** | Creación de contenido |
| **PÚBLICO** | Lectura limitada |

---

## 📡 Endpoints

### Autenticación
- `POST /auth/register` - Registrar
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### Usuarios
- `GET /user/me` - Usuario actual
- `GET /user/{uid}` - Usuario por ID
- `PUT /user/update` - Actualizar perfil
- `PATCH /user/photo` - Cambiar foto

### Fotos
- `GET /photos/get/{uid}` - Obtener foto
- `POST /photos/create` - Crear foto
- `PUT /photos/edit/{uid}` - Editar foto

### Estilos
- `GET /styles/all` - Todos los estilos
- `POST /styles/create` - Crear estilo
- `PUT /styles/update/{uid}` - Actualizar
- `DELETE /styles/delete/{uid}` - Eliminar

### Grupos
- `GET /groups/get` - Todos los grupos
- `POST /groups/create` - Crear grupo
- `PUT /groups/update/{uid}` - Actualizar
- `DELETE /groups/delete/{uid}` - Eliminar

### Productos
- `GET /products/getAll` - Todos los productos
- `POST /products/create` - Crear obra
- `PATCH /products/status/{uid}` - Aprobar/Rechazar

---

## 🐳 Deployment

```bash
# Docker
docker build -t ustallery-server:latest .
docker run -d -p 3000:3000 --env-file .env ustallery-server:latest

# Docker Compose
docker-compose up -d
```

---

## 🔒 Seguridad Empresarial

### ✅ Políticas Implementadas

**1. Control de Acceso**
- ✅ Autenticación JWT obligatoria
- ✅ Validación de permisos granular
- ✅ Auditoría de acciones críticas

**3. Validación de Datos**
- ✅ Validación de inputs obligatoria
- ✅ Sanitización de datos
- ✅ CORS restrictivo
- ✅ TypeScript para type-safety

**4. Comunicación Segura**
- ✅ HTTPS/TLS en producción
- ✅ HSTS habilitado
- ✅ Cookies seguras y HttpOnly
- ✅ Cifrado de datos en tránsito

**5. Monitoreo**
- ✅ Logs detallados de acciones críticas
- ✅ Alertas de seguridad
- ✅ Auditorías regulares
- ✅ Penetration testing periódico

**6. Mantenimiento**
- ✅ Bun y dependencias actualizadas
- ✅ Escaneo de vulnerabilidades
- ✅ CI/CD con controles
- ✅ Backups regulares

---

**Última actualización:** 2026-04-17  
**Versión:** 1.0.0  
**Runtime:** Bun v1.0+
