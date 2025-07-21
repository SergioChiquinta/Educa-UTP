# Sistema de Gestión de Recursos Educativos - EducaUTP

**EducaUTP** es una plataforma web desarrollada como proyecto final del curso _Herramientas de Desarrollo_, orientada a mejorar la organización, clasificación y distribución de materiales académicos digitales dentro de la Universidad Tecnológica del Perú (UTP). El sistema está diseñado con autenticación por roles y permite a docentes, estudiantes y administradores interactuar de forma segura y eficiente con recursos académicos.

## Objetivo General
Desarrollar una solución centralizada que permita a los docentes subir y clasificar materiales educativos, y a los estudiantes acceder a ellos mediante filtros de búsqueda inteligentes. Además, ofrece un panel administrativo para gestionar usuarios y monitorear estadísticas del sistema.

---

## Componentes Principales

### Autenticación y Control de Accesos
- Implementación de login con **JWT**.
- Middleware para rutas protegidas según roles: `docente`, `estudiante` y `administrador`.
- Contraseñas cifradas con `bcrypt`.

### Gestión de Recursos Educativos
- Subida de archivos en formato **PDF** y **DOCX**, alojados en **Cloudinary (modo raw/image)**.
- Metadatos obligatorios: título, curso, categoría, autores, descripción.
- Clasificación por curso, categoría y tipo de documento.
- Visualización previa (modal React + PDF.js/docx-preview).
- Descarga protegida por autenticación.

### Panel Administrativo
- Gestión de usuarios: creación, edición, eliminación y filtrado.
- Moderación de recursos: estados (`pendiente`, `aprobado`, `rechazado`).
- Visualización de métricas clave: recursos subidos, usuarios activos, recursos más consultados.

### Búsqueda Avanzada
- Búsqueda por palabras clave en título y descripción.
- Filtros dinámicos por tipo, curso y categoría.
- Interfaz responsiva y funcional para escritorio y móvil.

### ChatBot integrado
- Asistente conversacional desarrollado con **Landbot.io**, embebido como componente React en la plataforma.

---

## Arquitectura en la Nube

- **Frontend** desplegado en **Render**.
- **Backend API RESTful** desplegado en **Render**.
- **Base de datos MySQL** alojada en **Railway**.
- **Gestión de archivos** en **Cloudinary** (documentos académicos + fotos de perfil).
- Variables de entorno seguras vía `.env` en entorno cloud.

---

## Tecnologías Utilizadas

| Categoría        | Tecnología                        |
|------------------|------------------------------------|
| Frontend         | React.js, Tailwind CSS             |
| Backend          | Node.js, Express.js, JWT, Bcrypt   |
| Base de Datos    | MySQL (Railway)                    |
| Nube & Hosting   | Render, Cloudinary                 |
| Gestión          | ClickUp, GitHub, Slack, Zoom       |
| Prototipado UI   | Figma                              |
| ChatBot          | Landbot.io                         |

---

## Repositorio del Proyecto

> Este repositorio contiene todo el código fuente del sistema EducaUTP:
- Estructura del frontend y backend, el último está separado en una carpeta independiente.
- Scripts SQL de base de datos (`/sql`).
- Manuales, prototipos y enlaces de documentación se adjuntan en los siguientes enlaces:
  - Documentación Final del Proyecto (Avances por Sprints):
  - Manual de Usuarios::
  - Manual de Configuración del Sistema:
  - Informe Técnico Final:

🔗 **Repositorio GitHub**: [github.com/SergioChiquinta/Educa-UTP](https://github.com/SergioChiquinta/Educa-UTP)

---
