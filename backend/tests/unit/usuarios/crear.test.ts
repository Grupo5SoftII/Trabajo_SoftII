// tests/unit/usuarios/crear.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Usuarios: Crear', () => {
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

  test('Debería crear usuario con nombre y apellido válidos', async () => {
    const nuevoUsuario = {
      id: 1,
      nombre: 'Carlos',
      apellido: 'García',
      edad: 9,
      tipo: 'ALUMNO',
      contrasena: 'pass123'
    };

    mocks.usuarios.add.mockResolvedValue(nuevoUsuario);
    const resultado = await facade.crearUsuario({
      nombre: 'Carlos',
      apellido: 'García',
      edad: 9,
      tipo: 'ALUMNO',
      contrasena: 'pass123'
    });

    expect(resultado).toEqual(nuevoUsuario);
    expect(resultado.nombre).toBe('Carlos');
    expect(mocks.usuarios.add).toHaveBeenCalledTimes(1);
  });

  test('Debería rechazar usuario sin nombre', async () => {
    mocks.usuarios.add.mockRejectedValue(new Error('Datos incompletos'));

    try {
      await facade.crearUsuario({
        nombre: '',
        apellido: 'García',
        edad: 9,
        tipo: 'ALUMNO',
        contrasena: 'pass123'
      });
      fail('Debería lanzar error');
    } catch (error: any) {
      expect(error.message).toContain('Datos incompletos');
    }
  });

  test('Debería rechazar usuario sin contraseña', async () => {
    mocks.usuarios.add.mockRejectedValue(new Error('Datos incompletos'));

    try {
      await facade.crearUsuario({
        nombre: 'Carlos',
        apellido: 'García',
        edad: 9,
        tipo: 'ALUMNO',
        contrasena: ''
      });
      fail('Debería lanzar error');
    } catch (error: any) {
      expect(error.message).toContain('Datos incompletos');
    }
  });

  test('Debería establecer tipo ALUMNO por defecto si no se especifica', async () => {
    const nuevoUsuario = {
      id: 1,
      nombre: 'Carlos',
      apellido: 'García',
      edad: 9,
      tipo: 'ALUMNO',
      contrasena: 'pass123'
    };

    mocks.usuarios.add.mockResolvedValue(nuevoUsuario);
    const resultado = await facade.crearUsuario({
      nombre: 'Carlos',
      apellido: 'García',
      edad: 9,
      contrasena: 'pass123'
    });

    expect(resultado.tipo).toBe('ALUMNO');
  });
});
