# pictotap-backend

Backend en TypeScript con repositorios contra PostgreSQL. El chat usa pictogramas; cada mensaje guarda el `pictogramaId` y todas las operaciones del backend persisten en la BD.

## Requisitos
- Node.js 18+ (recomendado 20+)
- PostgreSQL 14+ en ejecución y accesible

## Configuración de la base de datos
1) Crear la BD (por defecto se usa `pictotap` en `localhost:5432` con usuario `postgres` y password `postgres`, puedes cambiarlo):
```bash
createdb pictotap
```

2) Variables de entorno (opcional si usas los valores por defecto):
```bash
# Windows (PowerShell)
set DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
set PGSSLMODE=require  # solo si necesitas SSL (ej: servicios gestionados)
```

3) Aplicar esquema y seed (tablas: usuarios, aulas, usuario_aula, chats, pictogramas, mensajes):
```bash
npm install
npm run db:init
```

El seed crea usuarios/profesor, aula, chat y pictogramas base. Las secuencias quedan sincronizadas para aceptar nuevos registros.

## Ejecutar la API
```bash
npm start
```

La API arranca en `http://localhost:3001`, inicializa la BD con `db:init` automáticamente y expone Socket.IO en el mismo puerto HTTP.

## Demo rápida (usa la BD real)
```bash
npm run demo
```
Muestra en consola el flujo de asignación a aula y envío de pictogramas guardando en PostgreSQL.

## Endpoints REST
- Usuarios: `GET/POST/PUT/DELETE /usuarios` y `GET /usuarios/:id`
- Aulas: `GET/POST/PUT/DELETE /aulas` y `GET /aulas/:id`
- Chats: `GET/POST/PUT/DELETE /chats` y `GET /chats/:id`
- Pictogramas: `GET/POST/PUT/DELETE /pictogramas` y `GET /pictogramas/:id`
- Inscripciones: `GET /inscripciones`, `POST /aulas/:aulaId/usuarios/:usuarioId`, `DELETE /aulas/:aulaId/usuarios/:usuarioId`
- Mensajes de chat: `GET/POST /chats/:chatId/mensajes`, `PUT/DELETE /chats/:chatId/mensajes/:mensajeId`

## Estructura
- src/domain: Entidades de dominio (Usuario, Aula, Chat, etc.)
- src/infra: Conexión Postgres (`PostgresClient`), schema SQL y repositorios concretos
- src/services: Facade con casos de uso
- src/controllers: Controladores simulados (solo prints)
- src/main.ts: Runner que hace seed en Postgres y ejecuta el flujo demo
