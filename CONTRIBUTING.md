# Guía de Convenciones y Buenas Prácticas de Control de Versiones

Este documento establece las directrices obligatorias de control de versiones y trabajo colaborativo para el desarrollo del proyecto **EntrePares**, asegurando la trazabilidad, orden y calidad técnica en cada entrega evaluable.

---

## 1. Modelo de Ramas

El proyecto utiliza un modelo de ramas de funcionalidad:

* **`main`**: Rama protegida. Contiene únicamente código estable, probado y listo para entrega o evaluación.
* **Ramas de desarrollo / tareas**:
  * Formato obligatorio: `<usuario>/<nombre-tarea>`
  * La rama identifica al responsable y el objetivo general de la tarea.
  * *Ejemplos:*
    * `ignacio/frontend-mockup`
    * `peter/api-services`

> **Regla:** Queda prohibido realizar commits directos sobre `main`. Todo código debe integrarse mediante Pull Request (PR) o Merge verificado por la contraparte.

---

## 2. Convención de Mensajes de Commit

Cada commit debe describir con precisión la acción realizada utilizando el estándar:

```text
<tipo>(<alcance opcional>): <descripción corta en imperativo>
```

### Tipos admitidos:

`feat`: Incorporación de nueva funcionalidad o pantalla.
`fix`: Corrección de un bug o fallo técnico.
`docs`: Modificaciones exclusivas en documentación (README, CONTRIBUTING, comentarios).
`style`: Ajustes de formato, espaciado o CSS que no alteran la lógica.
`refactor`: Reestructuración o desacoplamiento de código.
`chore`: Tareas de configuración, scripts del build o actualización de dependencias.

## 3. Versionado:

Para cada hito académico o entrega ante docente guía se generará un versionado siguiendo `vMAYOR.MENOR`
Ej:
- v0.1: Entrega Hito 1 - Mockup Frontend navegable y arquitectura base.
- v1.0: Entrega Final - Aplicación integral funcional y desplegable.

## 4. Flujo de trabajo y Sincronización

1. Actualización continua: Antes de crear una rama o subir cambios:
```Bash
git checkout main
git pull origin main
git checkout mi-rama
git merge main
```

2. Higiene de repositorio: Ningún integrante debe versionar archivos ignorados.
- node_modules/, .angular/cache/, .env.
