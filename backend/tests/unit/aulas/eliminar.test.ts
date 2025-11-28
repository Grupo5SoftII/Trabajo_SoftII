// tests/unit/aulas/eliminar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Aulas: Eliminar', () => {
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

  test('Debería eliminar aula y sus datos asociados', async () => {
    const chat = { id: 1, aulaId: 1 };

    mocks.chats.getByAulaId.mockResolvedValue(chat);
    mocks.mensajes.deleteByChat.mockResolvedValue(undefined);
    mocks.chats.delete.mockResolvedValue(undefined);
    mocks.usuarioAula.removeByAula.mockResolvedValue(undefined);
    mocks.aulas.delete.mockResolvedValue(undefined);

    await facade.eliminarAula(1);

    expect(mocks.chats.getByAulaId).toHaveBeenCalledWith(1);
    expect(mocks.mensajes.deleteByChat).toHaveBeenCalledWith(1);
    expect(mocks.chats.delete).toHaveBeenCalledWith(1);
    expect(mocks.usuarioAula.removeByAula).toHaveBeenCalledWith(1);
    expect(mocks.aulas.delete).toHaveBeenCalledWith(1);
  });

  test('Debería proceder con eliminación incluso si aula no tiene chats', async () => {
    mocks.chats.getByAulaId.mockResolvedValue(null);
    mocks.usuarioAula.removeByAula.mockResolvedValue(undefined);
    mocks.aulas.delete.mockResolvedValue(undefined);

    await facade.eliminarAula(999);

    expect(mocks.chats.getByAulaId).toHaveBeenCalledWith(999);
    expect(mocks.usuarioAula.removeByAula).toHaveBeenCalledWith(999);
    expect(mocks.aulas.delete).toHaveBeenCalledWith(999);
  });
});
