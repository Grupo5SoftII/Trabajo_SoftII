# CASOS DE PRUEBA - VALIDACIÓN DE INTEGRIDAD BD

## Instrucciones de Uso

1. **Importar Colección**: Importa el archivo `PICTOTAP_Postman_Collection.json` en Postman
2. **Configurar Variables**: La variable `base_url` ya está configurada como `http://localhost:3001`
3. **Ejecutar en Orden**: Los requests están numerados para ejecutarse secuencialmente
4. **Verificar Tests**: Cada request incluye tests automáticos que validan las respuestas

## Validaciones Clave de Base de Datos

### 1. **Persistencia de Datos**
- ✅ Los datos creados se mantienen entre requests
- ✅ Los IDs se autogeneran correctamente
- ✅ Las actualizaciones modifican solo los campos especificados

### 2. **Integridad Referencial**
- ✅ No se pueden crear aulas sin profesor válido
- ✅ No se pueden enviar mensajes con pictogramas inexistentes
- ✅ Las eliminaciones en cascada funcionan correctamente

### 3. **Validaciones de Negocio**
- ✅ Los tipos de usuario son válidos (PROFESOR, ALUMNO)
- ✅ Las edades son números positivos
- ✅ Los nombres no pueden estar vacíos

### 4. **Manejo de Errores**
- ✅ Status codes correctos (200, 201, 400, 404)
- ✅ Mensajes de error informativos
- ✅ Respuestas consistentes en formato JSON

## Checklist de Validación Manual

### Antes de Ejecutar
- [ ] Servidor corriendo en puerto 3001
- [ ] Base de datos PostgreSQL conectada
- [ ] Datos semilla cargados (npm run db:init)

### Durante la Ejecución
- [ ] Todos los GET requests devuelven status 200
- [ ] Todos los POST requests devuelven status 201
- [ ] Los PUT requests devuelven status 200
- [ ] Los DELETE requests devuelven status 200
- [ ] Los requests de error devuelven 400/404

### Validaciones Específicas por Entidad

#### Usuarios
- [ ] Listar usuarios muestra datos iniciales (Ana, Luis, Mia)
- [ ] Crear usuario genera ID único
- [ ] Actualizar usuario mantiene campos no modificados
- [ ] Eliminar usuario funciona si no tiene referencias

#### Aulas
- [ ] Crear aula requiere profesor válido
- [ ] Actualizar aula mantiene profesor si no se especifica
- [ ] Eliminar aula elimina chat asociado (cascada)

#### Pictogramas
- [ ] Crear pictograma con URL e ID opcionales
- [ ] Listar pictogramas muestra datos semilla
- [ ] Actualizar pictograma individual

#### Chats y Mensajes
- [ ] Chat se crea automáticamente con aula
- [ ] Enviar mensaje requiere emisor y pictograma válidos
- [ ] Listar mensajes ordena por fecha
- [ ] Eliminar mensaje individual

#### Inscripciones
- [ ] Inscribir usuario a aula (relación muchos-muchos)
- [ ] No duplicar inscripciones existentes
- [ ] Desinscribir usuario funciona

## Resultados Esperados por Request

| Request | Status | Validación Principal |
|---------|--------|---------------------|
| 0. Info API | 200 | Estructura de respuesta correcta |
| 1. GET Usuarios | 200 | Array con usuarios semilla |
| 2. POST Usuario | 201 | Usuario creado con ID |
| 3. GET Usuario Específico | 200 | Usuario correcto por ID |
| 4. PUT Usuario | 200 | Campos actualizados |
| 5. GET Pictogramas | 200 | Array con pictogramas semilla |
| 6. POST Pictograma | 201 | Pictograma creado |
| 7. GET Aulas | 200 | Array con aulas |
| 8. POST Aula | 201 | Aula creada con profesor válido |
| 9. GET Chats | 200 | Chats existentes |
| 10. GET Mensajes | 200 | Mensajes del chat |
| 11. POST Mensaje | 200 | Mensaje enviado |
| 12. GET Inscripciones | 200 | Relaciones usuario-aula |
| 13. POST Inscripción | 200 | Inscripción creada |
| 14. ERROR Usuario 99999 | 404 | Usuario no encontrado |
| 15. ERROR Datos Inválidos | 400 | Validación de datos |
| 96-99. DELETE Tests | 200 | Limpieza de datos test |

## Troubleshooting

### Si falla el servidor:
```bash
cd backend
npm start
```

### Si fallan los datos semilla:
```bash
npm run db:init
```

### Si hay errores de conexión:
1. Verificar PostgreSQL corriendo
2. Verificar credenciales en .env
3. Verificar puerto 3001 libre

### Si fallan las validaciones:
1. Revisar logs del servidor
2. Verificar estructura de la base de datos
3. Comprobar que no hay datos corruptos

## Automatización Avanzada

### Variables Globales Utilizadas:
- `test_usuario_id` - ID del usuario creado para pruebas
- `test_aula_id` - ID del aula creada para pruebas  
- `test_pictogram_id` - ID del pictograma creado
- `test_mensaje_id` - ID del mensaje enviado

### Scripts de Test Incluidos:
- Validación automática de status codes
- Captura automática de IDs para requests posteriores
- Verificación de estructura de respuestas
- Validación de campos requeridos

Estos tests garantizan que la comunicación entre tu backend y la base de datos PostgreSQL funcione correctamente en todos los escenarios.