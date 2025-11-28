// tests/unit/pictogramas/obtener.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Pictogramas: Obtener', () => {
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

  test('Debería obtener un pictograma por ID', async () => {
    const pictograma = {
      id: 1,
      nombre: 'Gato',
      descripcion: 'Animal',
      url: 'http://gato.png'
    };

    mocks.pictos.getById.mockResolvedValue(pictograma);
    const resultado = await facade.obtenerPictograma(1);

    expect(resultado).toEqual(pictograma);
    expect(resultado.nombre).toBe('Gato');
    expect(mocks.pictos.getById).toHaveBeenCalledWith(1);
  });
});
