// tests/unit/aulas/obtener.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Aulas: Obtener', () => {
  let facade: PictotapFacade;
  let mocks: any;

  beforeEach(() => {
    mocks = createMockRepos();
    resetAll(mocks);

    facade = new PictotapFacade(
      mocks.usuarios,
      mocks.aulas,
      mocks.usuarioAula,
      mocks.chats,
      mocks.pictos,
      mocks.mensajes
    );
  });

  test('Debería obtener un aula por ID', async () => {
    const aula = { id: 1, codigo: 1, materia: 'Matemáticas', grado: 'General', profesorId: 1 };

    mocks.aulas.getById.mockResolvedValue(aula);
    const resultado = await facade.obtenerAula(1);

    expect(resultado.id).toBe(1);
    expect(resultado.materia).toBe('Matemáticas');
  });

  test('Debería lanzar error si aula no existe', async () => {
    mocks.aulas.getById.mockResolvedValue(null);

    await expect(facade.obtenerAula(999)).rejects.toThrow('Aula no existe');
  });
});
