# Validaciones de API - Backend PICTOTAP

## Configuración Inicial
- **Base URL**: `http://localhost:3001`
- **Headers**: `Content-Type: application/json`
- **Servidor**: Asegúrate de tener el servidor corriendo con `npm start`

## 1. USUARIOS - CRUD Completo

### 1.1 GET - Listar todos los usuarios
```
GET {{base_url}}/usuarios
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Array con usuarios predefinidos (Profe Ana, Luis, Mia)
- Verificar estructura: `id`, `nombre`, `edad`, `tipo`

### 1.2 GET - Obtener usuario específico
```
GET {{base_url}}/usuarios/1
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Usuario con id=1 (Profe Ana)
- Verificar que tipo sea "PROFESOR"

### 1.3 POST - Crear nuevo usuario
```
POST {{base_url}}/usuarios
Content-Type: application/json

{
  "nombre": "Carlos Test",
  "edad": 25,
  "tipo": "PROFESOR"
}
```
**Validaciones esperadas:**
- Status: 201 Created
- Response: Usuario creado con ID autogenerado
- Verificar que todos los campos estén presentes

### 1.4 PUT - Actualizar usuario
```
PUT {{base_url}}/usuarios/{{nuevo_id}}
Content-Type: application/json

{
  "nombre": "Carlos Updated",
  "edad": 26
}
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Usuario actualizado con cambios aplicados
- Verificar que solo se modificaron los campos enviados

### 1.5 DELETE - Eliminar usuario
```
DELETE {{base_url}}/usuarios/{{nuevo_id}}
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: `{"ok": true}`

### 1.6 GET - Verificar eliminación
```
GET {{base_url}}/usuarios/{{nuevo_id}}
```
**Validaciones esperadas:**
- Status: 404 Not Found
- Response: Error indicando que no se encontró

## 2. AULAS - CRUD Completo

### 2.1 GET - Listar todas las aulas
```
GET {{base_url}}/aulas
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Array con aula predefinida (1ro Primaria A)

### 2.2 POST - Crear nueva aula
```
POST {{base_url}}/aulas
Content-Type: application/json

{
  "nombre": "2do Primaria B",
  "grado": "2do",
  "profesorEncargado": 1
}
```
**Validaciones esperadas:**
- Status: 201 Created
- Response: Aula creada con ID autogenerado
- Verificar referencia a profesor existente

### 2.3 PUT - Actualizar aula
```
PUT {{base_url}}/aulas/{{nueva_aula_id}}
Content-Type: application/json

{
  "nombre": "2do Primaria B - Updated"
}
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Aula actualizada

### 2.4 DELETE - Eliminar aula
```
DELETE {{base_url}}/aulas/{{nueva_aula_id}}
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: `{"ok": true}`

## 3. PICTOGRAMAS - CRUD Completo

### 3.1 GET - Listar pictogramas
```
GET {{base_url}}/pictogramas
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Array con pictogramas predefinidos (HOLA, BAÑO, AGUA)

### 3.2 POST - Crear pictograma
```
POST {{base_url}}/pictogramas
Content-Type: application/json

{
  "url": "https://picsum.photos/seed/test/64",
  "titulo": "TEST_PICTOGRAM"
}
```
**Validaciones esperadas:**
- Status: 201 Created
- Response: Pictograma creado con ID autogenerado

### 3.3 PUT - Actualizar pictograma
```
PUT {{base_url}}/pictogramas/{{nuevo_pictograma_id}}
Content-Type: application/json

{
  "titulo": "TEST_UPDATED"
}
```

### 3.4 DELETE - Eliminar pictograma
```
DELETE {{base_url}}/pictogramas/{{nuevo_pictograma_id}}
```

## 4. CHATS - CRUD Completo

### 4.1 GET - Listar chats
```
GET {{base_url}}/chats
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Array con chat predefinido del aula

### 4.2 POST - Crear chat
```
POST {{base_url}}/chats
Content-Type: application/json

{
  "tipo": "AULA",
  "aulaId": 10
}
```

## 5. INSCRIPCIONES - Relaciones Usuario-Aula

### 5.1 GET - Listar inscripciones
```
GET {{base_url}}/inscripciones
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Array con inscripciones existentes

### 5.2 POST - Inscribir usuario a aula
```
POST {{base_url}}/aulas/10/usuarios/2
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: `{"ok": true}`

### 5.3 DELETE - Desinscribir usuario
```
DELETE {{base_url}}/aulas/10/usuarios/2
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: `{"ok": true}`

## 6. MENSAJES - Funcionalidad de Chat

### 6.1 GET - Listar mensajes de chat
```
GET {{base_url}}/chats/100/mensajes
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Array de mensajes del chat

### 6.2 POST - Enviar mensaje pictograma
```
POST {{base_url}}/chats/100/mensajes
Content-Type: application/json

{
  "emisorId": 2,
  "pictogramaId": 1000
}
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Mensaje creado con timestamp automático

### 6.3 PUT - Actualizar mensaje
```
PUT {{base_url}}/chats/100/mensajes/{{mensaje_id}}
Content-Type: application/json

{
  "pictogramaId": 1001
}
```

### 6.4 DELETE - Eliminar mensaje
```
DELETE {{base_url}}/chats/100/mensajes/{{mensaje_id}}
```

## 7. VALIDACIONES DE ERROR - Casos Negativos

### 7.1 Usuario inexistente
```
GET {{base_url}}/usuarios/99999
```
**Validación esperada:**
- Status: 404 Not Found

### 7.2 Datos inválidos
```
POST {{base_url}}/usuarios
Content-Type: application/json

{
  "nombre": "",
  "edad": -5,
  "tipo": "INVALID"
}
```
**Validación esperada:**
- Status: 400 Bad Request

### 7.3 Referencia inexistente
```
POST {{base_url}}/aulas
Content-Type: application/json

{
  "nombre": "Test Aula",
  "grado": "1ro",
  "profesorEncargado": 99999
}
```
**Validación esperada:**
- Status: 400 Bad Request

## 8. VALIDACIÓN DE INTEGRIDAD REFERENCIAL

### 8.1 Intentar eliminar usuario con referencias
```
DELETE {{base_url}}/usuarios/1
```
**Validación esperada:**
- Status: 400 Bad Request (si tiene aulas asignadas)

### 8.2 Intentar eliminar aula con chat
```
DELETE {{base_url}}/aulas/10
```
**Validación esperada:**
- Verificar que se eliminen en cascada los elementos dependientes

## 9. ENDPOINT DE INFORMACIÓN
```
GET {{base_url}}/
```
**Validaciones esperadas:**
- Status: 200 OK
- Response: Información de la API con lista de rutas disponibles

## 10. SECUENCIA DE PRUEBA COMPLETA

### Orden recomendado:
1. Verificar endpoint raíz
2. Listar datos existentes (usuarios, aulas, pictogramas, chats)
3. Crear nuevos elementos
4. Probar relaciones (inscripciones, mensajes)
5. Actualizar elementos
6. Probar casos de error
7. Eliminar elementos creados
8. Verificar eliminación

## Variables de Postman Recomendadas
```
base_url: http://localhost:3001
nuevo_usuario_id: {{capturar del POST}}
nueva_aula_id: {{capturar del POST}}
nuevo_pictograma_id: {{capturar del POST}}
nuevo_mensaje_id: {{capturar del POST}}
```

## Scripts de Test en Postman
Para automatizar las validaciones, puedes usar estos scripts en la pestaña "Tests":

```javascript
// Verificar status 200
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Verificar que response es JSON
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// Capturar ID para usar en siguientes requests
if (pm.response.json().id) {
    pm.globals.set("last_created_id", pm.response.json().id);
}
```