MOCKS.md

Cómo usar los mocks del backend en las pruebas

1) Propósito
- Centralizar factories para los repositorios usados por `PictotapFacade`.
- Evitar duplicación en tests y facilitar la configuración de comportamientos (resolves/rejects).

2) Ubicación
- Archivo de helpers: `tests/mocks/backendMocks.ts`

3) Uso básico (ejemplo en TypeScript / Jest)

```ts
import { createMockRepos, resetAll } from '../mocks/backendMocks';
import { PictotapFacade } from '../../src/services/PictotapFacade';

const { usuarios, aulas, usuarioAula, chats, pictos, mensajes } = createMockRepos();
const facade = new PictotapFacade(usuarios, aulas, usuarioAula, chats, pictos, mensajes);

beforeEach(() => {
  resetAll({ usuarios, aulas, usuarioAula, chats, pictos, mensajes });
});

test('ejemplo: obtener usuario inexistente', async () => {
  usuarios.getById.mockResolvedValue(null);
  await expect(facade.obtenerUsuario(999)).rejects.toThrow('Usuario no existe');
});
```

4) Patrón recomendado
- En cada test, configurar solo lo necesario: `mockResolvedValue`, `mockRejectedValue`, `mockReturnValue`.
- Verificar llamadas con `expect(mockFn).toHaveBeenCalledWith(...)`.
- Resetear mocks en `beforeEach` con `resetAll`.

5) Integración en los tests existentes
- Reemplaza creación manual de jest.fn() por `createMockRepos()` y pasa los mocks al constructor de `PictotapFacade`.

6) Ejecutar tests
- Unit: `npm run test:unit`
- Blackbox: `npm run test:blackbox`
- Whitebox: `npm run test:whitebox`
- Cobertura: `npm run test:coverage`

7) Notas TypeScript
- Si TypeScript reclama tipos, usa `as any` en los datos de prueba o añade una pequeña interfaz de tipos para los mocks.

8) Ejemplo avanzado
- Para mocks compartidos que requieran comportamientos diferentes según test, crear helpers dentro de cada test que llamen `.mockResolvedValueOnce(...)`.
