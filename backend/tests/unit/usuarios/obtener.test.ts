// tests/unit/usuarios/obtener.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Usuarios: Obtener', () => {
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

  test('Debería obtener un usuario por ID', async () => {
    const usuario = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 8,
      tipo: 'ALUMNO',
      contrasena: '123'
    };

    mocks.usuarios.getById.mockResolvedValue(usuario);
    const resultado = await facade.obtenerUsuario(1);

    expect(resultado).toEqual(usuario);
    expect(resultado.nombre).toBe('Juan');
    expect(mocks.usuarios.getById).toHaveBeenCalledWith(1);
  });

  test('Debería lanzar error si usuario no existe', async () => {
    mocks.usuarios.getById.mockResolvedValue(null);

    try {
      await facade.obtenerUsuario(999);
      fail('Debería lanzar error');
    } catch (error: any) {
      expect(error.message).toContain('Usuario no existe');
    }
  });
});
