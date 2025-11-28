// tests/unit/mensajes/eliminar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Mensajes: Eliminar', () => {
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

  test('Debería eliminar un mensaje del chat', async () => {
    mocks.mensajes.delete.mockResolvedValue(undefined);

    await facade.eliminarMensaje(1, 1);

    expect(mocks.mensajes.delete).toHaveBeenCalledWith(1);
  });
});
