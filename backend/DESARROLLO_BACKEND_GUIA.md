# PICTOTAP Backend - Guía de Desarrollo

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Estructura del Código](#estructura-del-código)
5. [API Endpoints](#api-endpoints)
6. [Configuración y Deployment](#configuración-y-deployment)
7. [Validaciones y Testing](#validaciones-y-testing)
8. [Problemas Resueltos](#problemas-resueltos)
9. [Próximos Pasos](#próximos-pasos)

---

## 📖 Descripción General

**PICTOTAP** es una aplicación educativa que facilita la comunicación mediante pictogramas para estudiantes con necesidades especiales. El backend proporciona una API RESTful que gestiona usuarios, aulas, chats y mensajes con pictogramas.

### Tecnologías Utilizadas
- **Backend**: Node.js + TypeScript + Express
- **Base de Datos**: PostgreSQL
- **ORM/Cliente**: pg (node-postgres)
- **WebSockets**: Socket.IO para comunicación en tiempo real
- **Build Tool**: tsx para desarrollo y ejecución

---

## 🏗️ Arquitectura del Proyecto

### Patrón de Capas Implementado

```
┌─────────────────────────────────────┐
│           API Layer (Express)        │
├─────────────────────────────────────┤
│          Controllers                │
├─────────────────────────────────────┤
│           Services                  │
│        (PictotapFacade)             │
├─────────────────────────────────────┤
│           Domain                    │
│       (Entidades/Models)            │
├─────────────────────────────────────┤
│         Infrastructure              │
│      (Repositories/Database)        │
└─────────────────────────────────────┘
```

### Principios de Diseño
- **Separación de Responsabilidades**: Cada capa tiene una función específica
- **Inversión de Dependencias**: Se usan interfaces para desacoplar capas
- **Domain-Driven Design**: Las entidades de dominio son el centro del diseño
- **Repository Pattern**: Abstracción del acceso a datos

---

## 🗄️ Configuración de Base de Datos

### Esquema Principal

La base de datos PostgreSQL está estructurada con las siguientes tablas principales:

```sql
usuarios (id, nombre, edad, tipo)
├── tipo: 'PROFESOR' | 'ALUMNO'
└── Referenciado por: aulas, mensajes, usuario_aula

aulas (id, nombre, grado, profesor_encargado)
├── profesor_encargado → usuarios(id)
└── Referenciado por: chats, usuario_aula

chats (id, tipo, aula_id)
├── tipo: 'AULA' (extensible para otros tipos)
├── aula_id → aulas(id) CASCADE
└── Referenciado por: mensajes

pictogramas (id, url, titulo)
└── Referenciado por: mensajes

usuario_aula (id, usuario_id, aula_id)
├── usuario_id → usuarios(id) CASCADE
├── aula_id → aulas(id) CASCADE
└── UNIQUE(usuario_id, aula_id)

mensajes (id, fecha, emisor_id, chat_id, pictograma_id)
├── fecha: TIMESTAMPTZ DEFAULT NOW()
├── emisor_id → usuarios(id) CASCADE
├── chat_id → chats(id) CASCADE
└── pictograma_id → pictogramas(id)
```

### Integridad Referencial

- **CASCADE**: Eliminación automática de dependientes (usuario_aula, mensajes)
- **RESTRICT**: Previene eliminación si hay referencias (profesor_encargado)
- **UNIQUE**: Previene inscripciones duplicadas usuario-aula

### Datos Semilla (Seed Data)

```sql
-- Usuario profesor por defecto
usuarios: Profe Ana (id=1, PROFESOR)

-- Usuarios estudiantes por defecto  
usuarios: Luis (id=2, ALUMNO), Mia (id=3, ALUMNO)

-- Aula por defecto
aulas: "1ro Primaria A" (id=10, profesor_encargado=1)

-- Chat automático del aula
chats: Chat aula (id=100, aula_id=10)

-- Pictogramas básicos
pictogramas: HOLA, BAÑO, AGUA (ids: 1000, 1001, 1002)

-- Inscripciones por defecto
usuario_aula: Luis y Mia en aula 10
```

---

## 📁 Estructura del Código

### `/src` - Código Principal

#### `/domain` - Entidades de Dominio
Clases que representan los conceptos centrales del negocio:

```typescript
// Usuario.ts
export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public edad: number,
    public tipo: 'PROFESOR' | 'ALUMNO'
  ) {}
}

// Aula.ts - Representa un salón de clases
// Chat.ts - Representa un espacio de conversación
// Pictograma.ts - Representa un símbolo de comunicación
// MensajePictograma.ts - Representa un mensaje enviado
// UsuarioAula.ts - Relación muchos-muchos usuario-aula
```

#### `/infra` - Capa de Infraestructura
Manejo de persistencia y conexión a base de datos:

```typescript
// PostgresClient.ts - Configuración del pool de conexiones
// Repositories.ts - Interfaces de repositorios
// PostgresRepositories.ts - Implementaciones PostgreSQL
// initDb.ts - Función de inicialización de esquema
// DatabaseSingleton.ts - Patrón Singleton para DB
```

**Importante**: Se resolvió un problema crítico donde `initDb.ts` causaba que el servidor terminara inmediatamente. La solución fue separar la lógica de auto-ejecución en `/scripts/initDb.ts`.

#### `/services` - Lógica de Negocio
```typescript
// PictotapFacade.ts - Orquestador principal que coordina
// todas las operaciones entre repositorios
```

#### `/controllers` - Controladores HTTP (No implementados)
```typescript
// Estructura preparada para controladores específicos:
// AulaController.ts, ChatController.ts, PictogramController.ts
```

#### Archivos Principales
```typescript
// server.ts - Configuración Express + Socket.IO + Rutas
// socket.ts - Lógica WebSocket para tiempo real  
// main.ts - Script de demostración/testing
```

### `/scripts` - Utilidades
```typescript
// initDb.ts - Script independiente para inicializar BD
```

---

## 🔌 API Endpoints

### Estructura Base
- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`
- **Patrón**: RESTful con operaciones CRUD estándar

### Endpoints por Entidad

#### 🧑‍🎓 Usuarios
```http
GET    /usuarios           # Listar todos
GET    /usuarios/:id       # Obtener específico
POST   /usuarios           # Crear nuevo
PUT    /usuarios/:id       # Actualizar
DELETE /usuarios/:id       # Eliminar
```

#### 🏫 Aulas
```http
GET    /aulas              # Listar todas
GET    /aulas/:id          # Obtener específica
POST   /aulas              # Crear nueva
PUT    /aulas/:id          # Actualizar
DELETE /aulas/:id          # Eliminar
```

#### 🎨 Pictogramas
```http
GET    /pictogramas        # Listar todos
GET    /pictogramas/:id    # Obtener específico
POST   /pictogramas        # Crear nuevo
PUT    /pictogramas/:id    # Actualizar
DELETE /pictogramas/:id    # Eliminar
```

#### 💬 Chats
```http
GET    /chats              # Listar todos
GET    /chats/:id          # Obtener específico
POST   /chats              # Crear nuevo
PUT    /chats/:id          # Actualizar
DELETE /chats/:id          # Eliminar
```

#### 📚 Inscripciones Usuario-Aula
```http
GET    /inscripciones                        # Listar todas las inscripciones
POST   /aulas/:aulaId/usuarios/:usuarioId    # Inscribir usuario a aula
DELETE /aulas/:aulaId/usuarios/:usuarioId    # Desinscribir usuario
```

#### 📨 Mensajes
```http
GET    /chats/:chatId/mensajes                    # Listar mensajes del chat
POST   /chats/:chatId/mensajes                    # Enviar mensaje
PUT    /chats/:chatId/mensajes/:mensajeId         # Actualizar mensaje
DELETE /chats/:chatId/mensajes/:mensajeId         # Eliminar mensaje
```

#### ℹ️ Información
```http
GET    /                   # Info de la API y rutas disponibles
```

### Ejemplos de Payloads

#### Crear Usuario
```json
POST /usuarios
{
  "nombre": "Juan Pérez",
  "edad": 8,
  "tipo": "ALUMNO"
}
```

#### Crear Aula
```json
POST /aulas
{
  "nombre": "2do Primaria B",
  "grado": "2do",
  "profesorEncargado": 1
}
```

#### Enviar Mensaje
```json
POST /chats/100/mensajes
{
  "emisorId": 2,
  "pictogramaId": 1000
}
```

---

## ⚙️ Configuración y Deployment

### Variables de Entorno (`.env`)
```env
DATABASE_URL=postgres://appuser:app12345@localhost:5432/pictotap
PGSSLMODE=disable
PORT=3001
```

### Scripts de Package.json
```json
{
  "start": "tsx src/server.ts",        // Iniciar servidor
  "socket": "tsx src/socket.ts",       // Solo WebSocket server  
  "demo": "tsx src/main.ts",           // Script de demostración
  "db:init": "tsx src/scripts/initDb.ts" // Inicializar BD
}
```

### Inicialización del Proyecto

1. **Instalar Dependencias**:
```bash
npm install
```

2. **Configurar Base de Datos**:
```bash
# Crear base de datos PostgreSQL 'pictotap'
# Crear usuario 'appuser' con contraseña 'app12345'
# O modificar .env con tus credenciales
```

3. **Inicializar Esquema**:
```bash
npm run db:init
```

4. **Iniciar Servidor**:
```bash
npm start
```

### Dependencias Principales
```json
{
  "dependencies": {
    "express": "^4.19.2",           // Framework web
    "pg": "^8.16.3",               // Cliente PostgreSQL
    "socket.io": "^4.8.1",         // WebSockets
    "cors": "^2.8.5",              // CORS middleware
    "dotenv": "^17.2.3",           // Variables de entorno
    "morgan": "^1.10.0"            // Logging HTTP
  },
  "devDependencies": {
    "typescript": "^5.4.0",        // TypeScript
    "tsx": "^4.19.0",              // TS execution
    "@types/express": "^4.17.21",  // Types
    "@types/pg": "^8.15.6"         // Types PostgreSQL
  }
}
```

---

## 🧪 Validaciones y Testing

### Archivos de Testing Incluidos

1. **`POSTMAN_TESTS.md`**: Guía completa de validaciones manuales
2. **`PICTOTAP_Postman_Collection.json`**: Colección Postman importable con 17 requests
3. **`VALIDACION_BD_CHECKLIST.md`**: Checklist de validación y troubleshooting

### Tipos de Validaciones

#### ✅ Funcionales
- CRUD completo para todas las entidades
- Relaciones entre entidades (inscripciones, mensajes)
- Integridad referencial
- Validaciones de negocio (tipos, edades, nombres)

#### ✅ Técnicas  
- Status codes correctos (200, 201, 400, 404)
- Estructura de respuestas JSON consistente
- Manejo de errores y excepciones
- Persistencia de datos entre requests

#### ✅ Integración
- Conexión Backend ↔ Base de Datos
- Carga de datos semilla
- Transacciones y rollbacks
- Concurrencia básica

### Ejecución de Tests

1. **Importar Colección Postman**:
   - File → Import → `PICTOTAP_Postman_Collection.json`

2. **Ejecutar Secuencialmente**:
   - Los requests están numerados (0-99)
   - Incluyen tests automáticos  
   - Variables globales para IDs generados

3. **Verificar Resultados**:
   - Tests automáticos se ejecutan tras cada request
   - Verificar logs del servidor para errores
   - Comprobar estado de BD tras operaciones

---

## 🔧 Problemas Resueltos

### 1. Error de `rowCount` en PostgreSQL
**Problema**: `rowCount` podía ser `null` causando errores de comparación.

**Solución**: Implementado operador de fusión nula (`??`):
```typescript
// Antes
return rowCount > 0;  // Error si rowCount es null

// Después  
return (rowCount ?? 0) > 0;  // Seguro
```

### 2. Servidor Terminaba Inmediatamente
**Problema**: `initDb.ts` tenía lógica de auto-ejecución que terminaba el proceso con `process.exit(0)` incluso cuando se importaba desde `server.ts`.

**Solución**: 
- Separar lógica de inicialización en `/scripts/initDb.ts`
- Remover auto-ejecución de `/infra/initDb.ts`
- Actualizar `package.json` para usar nuevo script

### 3. Variables de Entorno No Cargaban
**Problema**: El archivo `.env` no se cargaba correctamente en algunos scripts.

**Solución**: Agregar `import "dotenv/config";` al inicio de archivos que lo necesiten.

### 4. Módulos ES6 vs CommonJS
**Problema**: Inconsistencias en imports/exports con módulos ES6.

**Solución**: 
- Configurar `"type": "module"` en `package.json`
- Usar extensiones `.js` en imports TypeScript
- Configurar `tsconfig.json` apropiadamente

---

## 🚀 Próximos Pasos

### Mejoras Inmediatas

#### 🏗️ Arquitectura
- [ ] Implementar controladores específicos (separar de `server.ts`)
- [ ] Agregar middleware de autenticación/autorización
- [ ] Implementar validación de input con schemas (Joi/Zod)
- [ ] Agregar logging estructurado (Winston)

#### 🔐 Seguridad
- [ ] Validación y sanitización de inputs
- [ ] Rate limiting
- [ ] Helmet para headers de seguridad
- [ ] Validación de tokens JWT

#### 📊 Base de Datos
- [ ] Migrations automáticas (en lugar de schema.sql manual)
- [ ] Connection pooling optimizado
- [ ] Índices para queries frecuentes
- [ ] Backup y recovery automatizado

#### 🧪 Testing
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración automatizados
- [ ] CI/CD pipeline
- [ ] Code coverage reporting

#### 📈 Performance
- [ ] Caching (Redis)
- [ ] Paginación en listados
- [ ] Compresión de respuestas
- [ ] Optimización de queries

#### 📱 Funcionalidades
- [ ] Upload de imágenes para pictogramas customizados
- [ ] Notificaciones push
- [ ] Historial de actividad
- [ ] Reportes y analytics
- [ ] API versioning

### Mejoras de WebSockets

#### 🔄 Tiempo Real
- [ ] Eventos de mensajes en tiempo real
- [ ] Notificaciones de usuarios conectados
- [ ] Typing indicators
- [ ] Sincronización estado entre clientes

#### 📡 Socket Events Sugeridos
```typescript
// Cliente → Servidor
'join-chat': { chatId: number, userId: number }
'send-message': { chatId: number, emisorId: number, pictogramaId: number }
'user-typing': { chatId: number, userId: number }

// Servidor → Cliente  
'message-received': MensajePictograma
'user-joined': { chatId: number, user: Usuario }
'user-left': { chatId: number, userId: number }
'typing-indicator': { chatId: number, userId: number, isTyping: boolean }
```

---

## 📚 Recursos Adicionales

### Documentación de Referencia
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Herramientas Recomendadas
- **Database**: pgAdmin, DBeaver para gestión de PostgreSQL
- **API Testing**: Postman, Insomnia, REST Client (VS Code)
- **Monitoring**: pg_stat_statements para queries, morgan para HTTP logs
- **Development**: VS Code con extensiones TypeScript y PostgreSQL

### Patrones y Arquitectura
- **Repository Pattern**: Implementado para abstracción de datos
- **Facade Pattern**: `PictotapFacade` como punto único de entrada
- **Dependency Injection**: Preparado para IoC containers
- **Domain-Driven Design**: Entidades centradas en el dominio

---

## 💡 Notas para el Desarrollo

### Convenciones de Código
- **Nombres**: camelCase para variables/métodos, PascalCase para clases
- **Archivos**: PascalCase para clases, camelCase para utilidades
- **Base de Datos**: snake_case para columnas, camelCase en TypeScript
- **APIs**: REST estándar, nombres plurales para recursos

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bugs  
docs: documentación
refactor: refactoring de código
test: agregar o corregir tests
chore: tareas de mantenimiento
```

### Variables de Entorno por Ambiente
```bash
# Desarrollo
DATABASE_URL=postgres://appuser:app12345@localhost:5432/pictotap
PORT=3001
NODE_ENV=development

# Producción  
DATABASE_URL=postgres://user:pass@prod-host:5432/pictotap
PORT=80
NODE_ENV=production
PGSSLMODE=require
```

---

**Fecha de Documentación**: Noviembre 2025  
**Versión Backend**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo PICTOTAP

Esta documentación cubre el estado actual del backend y proporciona una base sólida para futuros desarrolladores. Para preguntas específicas, consultar los archivos de código fuente o las validaciones de Postman incluidas.