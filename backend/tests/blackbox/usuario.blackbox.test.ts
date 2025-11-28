// tests/blackbox/usuario.blackbox.test.ts

import { PictotapFacade } from '../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../mocks/backendMocks';

describe('PictotapFacade - Pruebas Caja Negra: Usuarios', () => {
  let facade: PictotapFacade;
  let mockUsuarioRepo: any;
  let mockAulaRepo: any;
  let mockUsuarioAulaRepo: any;
  let mockChatRepo: any;
  let mockPictogramaRepo: any;
  let mockMensajeRepo: any;

  beforeEach(() => {
    const mocks = createMockRepos();
    mockUsuarioRepo = mocks.usuarios;
    mockAulaRepo = mocks.aulas;
    mockUsuarioAulaRepo = mocks.usuarioAula;
    mockChatRepo = mocks.chats;
    mockPictogramaRepo = mocks.pictos;
    mockMensajeRepo = mocks.mensajes;
    resetAll({ usuarios: mockUsuarioRepo, aulas: mockAulaRepo, usuarioAula: mockUsuarioAulaRepo, chats: mockChatRepo, pictos: mockPictogramaRepo, mensajes: mockMensajeRepo });

    facade = new PictotapFacade(
      mockUsuarioRepo,
      mockAulaRepo,
      mockUsuarioAulaRepo,
      mockChatRepo,
      mockPictogramaRepo,
      mockMensajeRepo
    );
  });

  // ========== VALIDACIÓN DE ENTRADA ==========

  test('Debe rechazar creación de usuario sin nombre', async () => {
    const datosIncompletos = { contrasena: 'pass123' };

    await expect(facade.crearUsuario(datosIncompletos))
      .rejects
      .toThrow('Datos incompletos');
  });

  test('Debe rechazar creación de usuario sin contraseña', async () => {
    const datosIncompletos = { nombre: 'Juan' };

    await expect(facade.crearUsuario(datosIncompletos))
      .rejects
      .toThrow('Datos incompletos');
  });

  test('Debe rechazar creación de usuario con ambos campos faltantes', async () => {
    const datosVacios = {};

    await expect(facade.crearUsuario(datosVacios))
      .rejects
      .toThrow('Datos incompletos');
  });

  test('Debe aceptar creación de usuario con datos mínimos válidos', async () => {
    const datosMinimos = { nombre: 'Juan', contrasena: 'pass123' };
    const usuarioCreado = { id: 1, nombre: 'Juan', apellido: '', edad: 0, tipo: 'ALUMNO', contrasena: 'pass123' };

    mockUsuarioRepo.add.mockResolvedValue(usuarioCreado);
    const resultado = await facade.crearUsuario(datosMinimos);

    expect(resultado.id).toBe(1);
    expect(resultado.nombre).toBe('Juan');
  });

  test('Debe aceptar creación de usuario con datos completos', async () => {
    const datosCompletos = {
      nombre: 'Juan',
      apellido: 'Pérez',
      edad: 8,
      tipo: 'ALUMNO',
      contrasena: 'pass123'
    };
    const usuarioCreado = { id: 1, ...datosCompletos };

    mockUsuarioRepo.add.mockResolvedValue(usuarioCreado);
    const resultado = await facade.crearUsuario(datosCompletos);

    expect(resultado.apellido).toBe('Pérez');
    expect(resultado.edad).toBe(8);
  });

  // ========== VALIDACIÓN DE EXISTENCIA ==========

  test('Debe rechazar obtención de usuario inexistente', async () => {
    mockUsuarioRepo.getById.mockResolvedValue(null);

    await expect(facade.obtenerUsuario(999))
      .rejects
      .toThrow('Usuario no existe');
  });

  test('Debe aceptar obtención de usuario existente', async () => {
    const usuario = { id: 1, nombre: 'Juan', apellido: 'Pérez', edad: 8, tipo: 'ALUMNO', contrasena: 'pass123' };

    mockUsuarioRepo.getById.mockResolvedValue(usuario);
    const resultado = await facade.obtenerUsuario(1);

    expect(resultado.id).toBe(1);
    expect(resultado.nombre).toBe('Juan');
  });

  // ========== VALIDACIÓN DE CASCADAS ==========

  test('Debe eliminar usuario y todas sus relaciones', async () => {
    const usuario = { id: 1, nombre: 'Juan', apellido: 'Pérez', edad: 8, tipo: 'ALUMNO', contrasena: 'pass123' };

    mockUsuarioRepo.getById.mockResolvedValue(usuario);
    mockUsuarioAulaRepo.removeByUsuario.mockResolvedValue(undefined);
    mockMensajeRepo.deleteByEmisor.mockResolvedValue(undefined);
    mockUsuarioRepo.delete.mockResolvedValue(undefined);

    await facade.eliminarUsuario(1);

    expect(mockUsuarioRepo.getById).toHaveBeenCalledWith(1);
    expect(mockUsuarioAulaRepo.removeByUsuario).toHaveBeenCalledWith(1);
    expect(mockMensajeRepo.deleteByEmisor).toHaveBeenCalledWith(1);
    expect(mockUsuarioRepo.delete).toHaveBeenCalledWith(1);
  });

  test('Debe rechazar eliminación de usuario inexistente', async () => {
    mockUsuarioRepo.getById.mockResolvedValue(null);

    await expect(facade.eliminarUsuario(999))
      .rejects
      .toThrow('Usuario no existe');

    expect(mockUsuarioAulaRepo.removeByUsuario).not.toHaveBeenCalled();
    expect(mockMensajeRepo.deleteByEmisor).not.toHaveBeenCalled();
    expect(mockUsuarioRepo.delete).not.toHaveBeenCalled();
  });

  // ========== COMPORTAMIENTO OBSERVABLE ==========

  test('Debe retornar lista vacía cuando no hay usuarios', async () => {
    mockUsuarioRepo.listAll.mockResolvedValue([]);

    const resultado = await facade.listarUsuarios();

    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });

  test('Debe retornar lista con usuarios cuando existen', async () => {
    const usuarios = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', edad: 8, tipo: 'ALUMNO', contrasena: 'pass123' },
      { id: 2, nombre: 'María', apellido: 'López', edad: 7, tipo: 'ALUMNO', contrasena: 'pass456' }
    ];

    mockUsuarioRepo.listAll.mockResolvedValue(usuarios);

    const resultado = await facade.listarUsuarios();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].nombre).toBe('Juan');
    expect(resultado[1].nombre).toBe('María');
  });

  test('Debe convertir tipo de usuario a mayúsculas', async () => {
    const datos = { nombre: 'Juan', contrasena: 'pass123', tipo: 'profesor' };
    const usuarioCreado = { id: 1, nombre: 'Juan', apellido: '', edad: 0, tipo: 'PROFESOR', contrasena: 'pass123' };

    mockUsuarioRepo.add.mockResolvedValue(usuarioCreado);
    const resultado = await facade.crearUsuario(datos);

    expect(resultado.tipo).toBe('PROFESOR');
  });

  test('Debe establecer tipo por defecto a ALUMNO', async () => {
    const datos = { nombre: 'Juan', contrasena: 'pass123' };
    const usuarioCreado = { id: 1, nombre: 'Juan', apellido: '', edad: 0, tipo: 'ALUMNO', contrasena: 'pass123' };

    mockUsuarioRepo.add.mockResolvedValue(usuarioCreado);
    const resultado = await facade.crearUsuario(datos);

    expect(resultado.tipo).toBe('ALUMNO');
  });
});
