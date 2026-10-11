# EntrePares

> Proyecto de Título - Capstone. EntrePares: Proyecto de Plataforma de Colaboración Académica Comunitaria

---

## Descripción del Proyecto

**EntrePares** es una solución digital orientada a optimizar los canales de apoyo estudiantil en la educación superior, permitiendo a los alumnos canalizar consultas académicas y coordinar apoyo pedagógico directamente con ayudantes de forma rápida y estructurada.

---

## Estado Actual y Entregables

- **Versión:** `v0.1.0` (Hito 1 - Prototipo navegable)
- **Frontend:** Implementación inicial de vistas clave (**Login** y **Home**) con arquitectura moderna basada en componentes desacoplados.
- **Roles contemplados:**
  - **Estudiante:** Creación de tickets de consulta y solicitud de ayudantías.
  - **Ayudante:** Visualización de solicitudes pendientes y toma de casos según la asignatura.

---

## Stack Tecnológico

- **Framework Base:** [Ionic Framework](https://ionicframework.com/) (v9.x)
- **Librería Core:** [Angular](https://angular.dev/) (Standalone Components)
- **Control de Versiones:** Git & GitHub
- **Entorno de Ejecución:** Node.js (24.x LTS) & npm

---

## Estructura del Repositorio

```
EntrePares/
├── frontend/             # Aplicación en Ionic / Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/   # Modelos e interfaces de datos (IUser.ts)
│   │   │   ├── pages/    # Vistas y pantallas enrutadas (login, home)
│   │   │   ├── app.component.*
│   │   │   └── app.routes.ts
│   │   └── assets/       # Recursos gráficos y multimedia
│   ├── angular.json
│   └── package.json
├── CONTRIBUTING.md       # Estándares de Git, ramas y versionado
└── README.md             # Documentación principal del proyecto
```

## Instalación y Ejecución en Local

### Requisitos previos

- Node.js instalado (LTS recomendado).
- Ionic CLI:
``` Bash
npm install -g @ionic/cli
```

### Pasos para levantar el Frontend
1. Clonar el repositorio:
``` Bash
git clone https://github.com/IgnacioAntGP/2026_2_MA_CAPSTONE_003D_GRUPO_2.git
cd EntrePares/frontend
```

2. Instalar dependencias del proyecto
``` Bash
npm install
```

3. Iniciar el servidor local de desarrollo:
``` Bash
ionic serve
```

4. Abrir en el navegador `http://localhost:8100/`

### Pasos para levantar el Backend - API REST

#### Variables de entorno

Se debe crear un archivo `.env` en la carpeta de `backend/`, este env debe contener las siguientes claves:

```javascript
PORT=3000
SUPABASE_URL:https://[TOKEN_URL].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[TOKEN]
```

El `TOKEN_URL` y `TOKEN` son claves secretas que operan dentro del entorno de supabase para la conexión con la URL del proyecto y el TOKEN que identifica al rol de developer (SOLICITAR A @IgnacioAntGP )

#### Cómo usarse

1. Configurar las variables de entorno en archivo `.env`

2. Ejecutar en cmd en la ruta de `backend/` las siguientes líneas:
    - `npm install` -> Para instalar los recursos para conectar con supabase y la política de CORS
    - `npm run dev` -> Inicializa el servidor en el puerto 3000

## Contribución

Para revisar la convención de ramas, nomenclatura de commits y versionado semántico exigidos para el proyecto, consulta el archivo `CONTRIBUTING.md`.
