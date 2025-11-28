// tests/unit/aulas/listar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Aulas: Listar', () => {
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

  test('Debería listar todas las aulas', async () => {
    const aulas = [
      { id: 1, codigo: 1, materia: 'Matemática', grado: '1', profesorId: 1 },
      { id: 2, codigo: 2, materia: 'Lengua', grado: '1', profesorId: 2 }
    ];

    mocks.aulas.listAll.mockResolvedValue(aulas);
    const resultado = await facade.listarAulas();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].materia).toBe('Matemática');
  });

  test('Debería retornar lista vacía cuando no hay aulas', async () => {
    mocks.aulas.listAll.mockResolvedValue([]);

    const resultado = await facade.listarAulas();

    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });
});
