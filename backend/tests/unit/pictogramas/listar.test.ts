// tests/unit/pictogramas/listar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Pictogramas: Listar', () => {
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

  test('Debería listar todos los pictogramas', async () => {
    const pictogramas = [
      { id: 1, nombre: 'Gato', descripcion: 'Animal', url: 'http://gato.png' },
      { id: 2, nombre: 'Perro', descripcion: 'Animal', url: 'http://perro.png' }
    ];

    mocks.pictos.listAll.mockResolvedValue(pictogramas);
    const resultado = await facade.listarPictogramas();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nombre).toBe('Gato');
    expect(mocks.pictos.listAll).toHaveBeenCalledTimes(1);
  });
});
