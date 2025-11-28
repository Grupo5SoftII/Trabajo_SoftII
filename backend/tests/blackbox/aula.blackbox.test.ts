// tests/blackbox/aula.blackbox.test.ts

import { PictotapFacade } from '../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../mocks/backendMocks';

describe('PictotapFacade - Pruebas Caja Negra: Aulas', () => {
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

  test('Debe rechazar creación de aula sin materia', async () => {
    const datosIncompletos = { grado: 'General' };

    await expect(facade.crearAula(datosIncompletos))
      .rejects
      .toThrow('Materia obligatoria');
  });

  test('Debe rechazar creación de aula con campos vacíos', async () => {
    const datosVacios = {};

    await expect(facade.crearAula(datosVacios))
      .rejects
      .toThrow('Materia obligatoria');
  });

  test('Debe aceptar creación de aula con datos mínimos válidos', async () => {
    const datosMinimos = { materia: 'Matemáticas' };
    const aulaCreada = { id: 1, codigo: 1, materia: 'Matemáticas', grado: 'General', profesorId: 0 };

    mockAulaRepo.add.mockResolvedValue(aulaCreada);
    const resultado = await facade.crearAula(datosMinimos);

    expect(resultado.id).toBe(1);
    expect(resultado.materia).toBe('Matemáticas');
  });

  test('Debe aceptar creación de aula con grado especificado', async () => {
    const datos = { materia: 'Inglés', grado: 'Quinto' };
    const aulaCreada = { id: 2, codigo: 2, materia: 'Inglés', grado: 'Quinto', profesorId: 0 };

    mockAulaRepo.add.mockResolvedValue(aulaCreada);
    const resultado = await facade.crearAula(datos);

    expect(resultado.grado).toBe('Quinto');
  });

  test('Debe usar grado por defecto si no se proporciona', async () => {
    const datos = { materia: 'Ciencias' };
    const aulaCreada = { id: 3, codigo: 3, materia: 'Ciencias', grado: 'General', profesorId: 0 };

    mockAulaRepo.add.mockResolvedValue(aulaCreada);
    const resultado = await facade.crearAula(datos);

    expect(resultado.grado).toBe('General');
  });

  test('Debe rechazar aula con materia nula', async () => {
    const datosInvalidos = { materia: null as any };

    await expect(facade.crearAula(datosInvalidos))
      .rejects
      .toThrow('Materia obligatoria');
  });

  test('Debe rechazar aula con materia vacía', async () => {
    const datosInvalidos = { materia: '' };

    await expect(facade.crearAula(datosInvalidos))
      .rejects
      .toThrow('Materia obligatoria');
  });

  test('Debe permitir asignar profesor encargado', async () => {
    const datos = { materia: 'Historia', profesorEncargado: 5 };
    const aulaCreada = { id: 4, codigo: 4, materia: 'Historia', grado: 'General', profesorId: 5 };

    mockAulaRepo.add.mockResolvedValue(aulaCreada);
    const resultado = await facade.crearAula(datos);

    expect(resultado.profesorId).toBe(5);
  });

  // ========== VALIDACIÓN DE EXISTENCIA ==========

  test('Debe rechazar obtención de aula inexistente', async () => {
    mockAulaRepo.getById.mockResolvedValue(null);

    await expect(facade.obtenerAula(999))
      .rejects
      .toThrow('Aula no existe');
  });

  test('Debe aceptar obtención de aula existente', async () => {
    const aula = { id: 1, codigo: 1, materia: 'Matemáticas', grado: 'General', profesorId: 1 };

    mockAulaRepo.getById.mockResolvedValue(aula);
    const resultado = await facade.obtenerAula(1);

    expect(resultado.id).toBe(1);
    expect(resultado.materia).toBe('Matemáticas');
  });

  // ========== VALIDACIÓN DE CASCADAS ==========

  test('Debe eliminar aula y todas sus relaciones', async () => {
    const aula = { id: 1, codigo: 1, materia: 'Matemáticas', grado: 'General', profesorId: 0 };
    const chat = { id: 101, aulaId: 1, nombre: 'Chat 1' };
    // nota: la implementación actual no consulta aula por id antes de eliminar
    mockChatRepo.getByAulaId.mockResolvedValue(chat);
    mockMensajeRepo.deleteByChat.mockResolvedValue(undefined);
    mockChatRepo.delete.mockResolvedValue(undefined);
    mockUsuarioAulaRepo.removeByAula.mockResolvedValue(undefined);
    mockAulaRepo.delete.mockResolvedValue(undefined);

    await facade.eliminarAula(1);

    // la implementación actual consulta chats por aulaId, elimina mensajes del chat y borra el chat
    expect(mockChatRepo.getByAulaId).toHaveBeenCalledWith(1);
    expect(mockMensajeRepo.deleteByChat).toHaveBeenCalledWith(101);
    expect(mockChatRepo.delete).toHaveBeenCalledWith(101);
    expect(mockUsuarioAulaRepo.removeByAula).toHaveBeenCalledWith(1);
    expect(mockAulaRepo.delete).toHaveBeenCalledWith(1);
  });

  test('Eliminar aula inexistente procede según implementación actual', async () => {
    mockChatRepo.getByAulaId.mockResolvedValue(null);
    mockUsuarioAulaRepo.removeByAula.mockResolvedValue(undefined);
    mockAulaRepo.delete.mockResolvedValue(undefined);

    await facade.eliminarAula(999);

    expect(mockChatRepo.getByAulaId).toHaveBeenCalledWith(999);
    expect(mockUsuarioAulaRepo.removeByAula).toHaveBeenCalledWith(999);
    expect(mockAulaRepo.delete).toHaveBeenCalledWith(999);
  });

  // ========== COMPORTAMIENTO OBSERVABLE ==========

  test('Debe retornar lista vacía cuando no hay aulas', async () => {
    mockAulaRepo.listAll.mockResolvedValue([]);

    const resultado = await facade.listarAulas();

    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });

  test('Debe retornar lista con aulas cuando existen', async () => {
    const aulas = [
      { id: 1, codigo: 1, materia: 'Matemáticas', grado: 'General', profesorId: 1 },
      { id: 2, codigo: 2, materia: 'Inglés', grado: 'General', profesorId: 2 }
    ];

    mockAulaRepo.listAll.mockResolvedValue(aulas);

    const resultado = await facade.listarAulas();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].materia).toBe('Matemáticas');
    expect(resultado[1].materia).toBe('Inglés');
  });

  test('Debe mantener orden de aulas en lista', async () => {
    const aulas = [
      { id: 1, codigo: 1, materia: 'Matemáticas', grado: 'General', profesorId: 1 },
      { id: 2, codigo: 2, materia: 'Inglés', grado: 'General', profesorId: 2 },
      { id: 3, codigo: 3, materia: 'Ciencias', grado: 'General', profesorId: 3 }
    ];

    mockAulaRepo.listAll.mockResolvedValue(aulas);

    const resultado = await facade.listarAulas();

    expect(resultado[0].materia).toBe('Matemáticas');
    expect(resultado[1].materia).toBe('Inglés');
    expect(resultado[2].materia).toBe('Ciencias');
  });

  test('Debe permitir asignar usuario a aula', async () => {
    mockUsuarioAulaRepo.add.mockResolvedValue(undefined);

    await facade.asignarUsuarioAAula(1, 1);

    expect(mockUsuarioAulaRepo.add).toHaveBeenCalledWith(1, 1);
  });

  test('Debe permitir desasignar usuario de aula', async () => {
    mockUsuarioAulaRepo.remove.mockResolvedValue(undefined);

    await facade.desasignarUsuarioAAula(1, 1);

    expect(mockUsuarioAulaRepo.remove).toHaveBeenCalledWith(1, 1);
  });

  test('Debe listar inscripciones correctamente', async () => {
    const inscripciones = [
      { usuarioId: 1, aulaId: 1 },
      { usuarioId: 2, aulaId: 1 },
      { usuarioId: 1, aulaId: 2 }
    ];

    mockUsuarioAulaRepo.listAll.mockResolvedValue(inscripciones);

    const resultado = await facade.listarInscripciones();

    expect(resultado).toHaveLength(3);
    expect(resultado[0].usuarioId).toBe(1);
  });
});
