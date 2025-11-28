// tests/unit/usuarios/listar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Usuarios: Listar', () => {
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

  test('Debería listar todos los usuarios', async () => {
    const usuarios = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', edad: 8, tipo: 'ALUMNO', contrasena: '123' },
      { id: 2, nombre: 'María', apellido: 'López', edad: 7, tipo: 'ALUMNO', contrasena: '456' }
    ];

    mocks.usuarios.listAll.mockResolvedValue(usuarios);
    const resultado = await facade.listarUsuarios();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nombre).toBe('Juan');
    expect(mocks.usuarios.listAll).toHaveBeenCalledTimes(1);
  });

  test('Debería retornar lista vacía cuando no hay usuarios', async () => {
    mocks.usuarios.listAll.mockResolvedValue([]);
    const resultado = await facade.listarUsuarios();

    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });
});
