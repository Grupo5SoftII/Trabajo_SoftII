// tests/unit/usuarioAula/listar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - UsuarioAula: Listar', () => {
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

  test('Debería listar todas las asignaciones usuario-aula', async () => {
    const asignaciones = [
      { usuarioId: 1, aulaId: 1 },
      { usuarioId: 2, aulaId: 1 },
      { usuarioId: 1, aulaId: 2 }
    ];

    mocks.usuarioAula.listAll.mockResolvedValue(asignaciones);
    const resultado = await facade.listarInscripciones();

    expect(resultado).toHaveLength(3);
    expect(resultado[0].usuarioId).toBe(1);
    expect(mocks.usuarioAula.listAll).toHaveBeenCalledTimes(1);
  });

  test('Debería retornar lista vacía si no hay asignaciones', async () => {
    mocks.usuarioAula.listAll.mockResolvedValue([]);
    const resultado = await facade.listarInscripciones();

    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });

  test('Debería listar múltiples usuarios en la misma aula', async () => {
    const asignaciones = [
      { usuarioId: 1, aulaId: 1 },
      { usuarioId: 2, aulaId: 1 },
      { usuarioId: 3, aulaId: 1 }
    ];

    mocks.usuarioAula.listAll.mockResolvedValue(asignaciones);
    const resultado = await facade.listarInscripciones();

    expect(resultado).toHaveLength(3);
    const aulaId1 = resultado.filter((a: any) => a.aulaId === 1);
    expect(aulaId1).toHaveLength(3);
  });

  test('Debería listar el mismo usuario en múltiples aulas', async () => {
    const asignaciones = [
      { usuarioId: 1, aulaId: 1 },
      { usuarioId: 1, aulaId: 2 },
      { usuarioId: 1, aulaId: 3 }
    ];

    mocks.usuarioAula.listAll.mockResolvedValue(asignaciones);
    const resultado = await facade.listarInscripciones();

    expect(resultado).toHaveLength(3);
    const usuarioId1 = resultado.filter((a: any) => a.usuarioId === 1);
    expect(usuarioId1).toHaveLength(3);
  });
});
