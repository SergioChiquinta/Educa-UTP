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

## Estructura del Repositorio
A continuación, se detalla la estructura jerárquica del proyecto en su versión final, correspondiente al último commit en la rama master. 
Esta estructura sigue una separación clara de responsabilidades entre backend, frontend, configuración, testing y recursos base, asegurando mantenibilidad y escalabilidad:

```
Educa-UTP/
├── 📁 backend/              # Código fuente de Node.js, Express, rutas, middlewares, etc.
├── 📁 build/                # Archivos generados tras la compilación de producción (React)
├── 📁 public/               # Recursos estáticos del frontend (favicon, index.html, etc.)
├── 📁 src/                  # Código fuente principal del frontend (componentes, vistas, etc.)
├── 📁 cypress/              # Pruebas (unitarias y funcionales) con Cypress

├── 📄 .env.example          # Archivo de ejemplo para configurar variables de entorno (.env)
├── 📄 .gitignore            # Archivos y carpetas ignoradas por Git
├── 📄 README.md             # Documento explicativo del proyecto y sus componentes

├── 📄 config-overrides.js   # Configuración personalizada para Webpack (React)
├── 📄 cypress.config.js     # Configuración general del entorno de pruebas Cypress
├── 📄 jest.config.js        # Configuración de pruebas unitarias con Jest

├── 📄 datos_login.sql       # Script SQL con usuarios predefinidos de prueba
├── 📄 educautp_db.sql       # Script principal de la base de datos del sistema

├── 📄 package.json          # Dependencias, scripts y metainformación del proyecto Node
├── 📄 package-lock.json     # Archivo de bloqueo para instalaciones consistentes
├── 📄 webpack.config.js     # Configuración principal de Webpack para el empaquetado
```

Notas:
- El código del frontend está organizado bajo src/, mientras que el backend se encuentra dentro de backend/.
- Las pruebas automatizadas están en cypress/, con configuración en cypress.config.js. Algunas pruebas unitarias en React se integran vía Jest.
- El archivo .env.example fue adaptado para despliegue en Render (frontend y backend) y Railway (base de datos).
- El proyecto está estructurado para adaptarse a un flujo de CI/CD básico compatible con entornos cloud.

## Repositorio del Proyecto

> Este repositorio contiene todo el código fuente del sistema EducaUTP:
- Estructura del frontend y backend, el último está separado en una carpeta independiente.
- Scripts SQL de base de datos (`.sql`).
- Manuales, prototipos y enlaces de documentación se adjuntan en los siguientes enlaces:
  - Documentación Final del Proyecto (Avances por Sprints): 🔗 [https://docs.google.com/document/d/1_awm0P2m6YB__Uatk2koW9cEhIMCqwZn/edit?usp=sharing&ouid=112056978032541725199&rtpof=true&sd=true](https://docs.google.com/document/d/1_awm0P2m6YB__Uatk2koW9cEhIMCqwZn/edit?usp=sharing&ouid=112056978032541725199&rtpof=true&sd=true)
  - Manual del Sistema / para Usuarios: 🔗 [https://www.canva.com/design/DAGrmmUKL8Y/5IORC7L6HXp04ed0qzGqcA/edit?utm_content=DAGrmmUKL8Y&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAGrmmUKL8Y/5IORC7L6HXp04ed0qzGqcA/edit?utm_content=DAGrmmUKL8Y&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
  - Manual de Configuración del Sistema: 🔗 [https://www.canva.com/design/DAGrml6Lw9g/n8VBMdj-ZYGuBIVIqOoZ5A/edit?utm_content=DAGrml6Lw9g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAGrml6Lw9g/n8VBMdj-ZYGuBIVIqOoZ5A/edit?utm_content=DAGrml6Lw9g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
  - Informe Técnico Final: 🔗 [https://docs.google.com/document/d/1QMc6lNx3wYpxX6T8HdyHsvHeflYodN-t/edit?usp=sharing&ouid=112056978032541725199&rtpof=true&sd=true](https://docs.google.com/document/d/1QMc6lNx3wYpxX6T8HdyHsvHeflYodN-t/edit?usp=sharing&ouid=112056978032541725199&rtpof=true&sd=true)

🔗 **Repositorio GitHub**: [github.com/SergioChiquinta/Educa-UTP](https://github.com/SergioChiquinta/Educa-UTP)

---
