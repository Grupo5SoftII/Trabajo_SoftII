// tests/unit/pictogramas/eliminar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Pictogramas: Eliminar', () => {
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

  test('Debería eliminar pictograma y sus mensajes asociados', async () => {
    mocks.mensajes.deleteByPictograma.mockResolvedValue(undefined);
    mocks.pictos.delete.mockResolvedValue(undefined);

    await facade.eliminarPictograma(1);

    expect(mocks.mensajes.deleteByPictograma).toHaveBeenCalledWith(1);
    expect(mocks.pictos.delete).toHaveBeenCalledWith(1);
  });

  test('Debería proceder con eliminación incluso si pictograma no tiene mensajes', async () => {
    mocks.mensajes.deleteByPictograma.mockResolvedValue(undefined);
    mocks.pictos.delete.mockResolvedValue(undefined);

    await facade.eliminarPictograma(999);

    expect(mocks.mensajes.deleteByPictograma).toHaveBeenCalledWith(999);
    expect(mocks.pictos.delete).toHaveBeenCalledWith(999);
  });
});
