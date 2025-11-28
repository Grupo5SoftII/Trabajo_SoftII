// tests/unit/pictogramas/crear.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Pictogramas: Crear', () => {
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

  test('Debería crear pictograma con nombre válido', async () => {
    const nuevoPictograma = {
      id: 1,
      nombre: 'Casa',
      descripcion: 'Lugar',
      url: 'http://casa.png'
    };

    mocks.pictos.add.mockResolvedValue(nuevoPictograma);
    const resultado = await facade.crearPictograma({
      nombre: 'Casa'
    });

    expect(resultado).toEqual(nuevoPictograma);
    expect(resultado.nombre).toBe('Casa');
    expect(mocks.pictos.add).toHaveBeenCalledTimes(1);
  });

  test('Debería rechazar pictograma sin nombre', async () => {
    try {
      await facade.crearPictograma({
        nombre: ''
      });
      fail('Debería lanzar error');
    } catch (error: any) {
      expect(error.message).toContain('Nombre obligatorio');
    }
  });

  test('Debería rechazar pictograma con nombre solo espacios en blanco', async () => {
    try {
      await facade.crearPictograma({
        nombre: '   '
      });
      fail('Debería lanzar error');
    } catch (error: any) {
      expect(error.message).toContain('Nombre obligatorio');
    }
  });

  test('Debería crear pictograma con nombre válido (camel case)', async () => {
    const nuevoPictograma = {
      id: 2,
      nombre: 'Árbol',
      descripcion: 'Planta',
      url: undefined
    };

    mocks.pictos.add.mockResolvedValue(nuevoPictograma);
    const resultado = await facade.crearPictograma({
      nombre: 'Árbol'
    });

    expect(resultado).toEqual(nuevoPictograma);
    expect(mocks.pictos.add).toHaveBeenCalledTimes(1);
  });
});
