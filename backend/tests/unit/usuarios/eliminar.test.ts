// tests/unit/usuarios/eliminar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Usuarios: Eliminar', () => {
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

  test('Debería eliminar usuario y sus asociaciones', async () => {
    mocks.usuarios.getById.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 8,
      tipo: 'ALUMNO',
      contrasena: '123'
    });
    mocks.usuarioAula.removeByUsuario.mockResolvedValue(undefined);
    mocks.mensajes.deleteByEmisor.mockResolvedValue(undefined);
    mocks.usuarios.delete.mockResolvedValue(undefined);

    await facade.eliminarUsuario(1);

    expect(mocks.usuarios.getById).toHaveBeenCalledWith(1);
    expect(mocks.usuarioAula.removeByUsuario).toHaveBeenCalledWith(1);
    expect(mocks.mensajes.deleteByEmisor).toHaveBeenCalledWith(1);
    expect(mocks.usuarios.delete).toHaveBeenCalledWith(1);
  });
});
