# pictotap-backend-mvp

Backend MVP en TypeScript (POO) con patrones Facade + Singleton y repositorios en memoria. No hay BD real; todo se prueba con console.log.

## Requisitos
- Node.js 18+ (recomendado 20+)

## Instalar y ejecutar

Opción A (desde la carpeta del backend):

```bash
npm i
npm start
```

Opción B (desde la raíz del repo):

```bash
npm run backend
```

Deberías ver en consola el flujo DEMO con altas de alumnos, envío de pictogramas y listado de mensajes.

## Estructura

- src/domain: Entidades de dominio (Usuario, Aula, Chat, etc.)
- src/infra: Singleton de "DB" y repositorios en memoria
- src/services: Facade con casos de uso
- src/controllers: Controladores simulados (solo prints)
- src/main.ts: Runner que hace seed y ejecuta el flujo DEMO
