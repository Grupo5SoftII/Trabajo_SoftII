// tests/blackbox/pictograma.blackbox.test.ts

import { PictotapFacade } from '../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../mocks/backendMocks';

describe('PictotapFacade - Pruebas Caja Negra: Pictogramas', () => {
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

    facade = new PictotapFacade(mockUsuarioRepo, mockAulaRepo, mockUsuarioAulaRepo, mockChatRepo, mockPictogramaRepo, mockMensajeRepo);
  });

  test('Debe listar pictogramas vacíos', async () => {
    mockPictogramaRepo.listAll.mockResolvedValue([]);
    const resultado = await facade.listarPictogramas();
    expect(resultado).toEqual([]);
  });

  test('Debe crear pictograma con nombre válido', async () => {
    const datos = { nombre: 'Perro', url: 'http://img' } as any;
    const pic = { id: 1, nombre: 'Perro' };
    mockPictogramaRepo.add.mockResolvedValue(pic);

    const resultado = await facade.crearPictograma(datos);
    expect(resultado.id).toBe(1);
    expect(resultado.nombre).toBe('Perro');
  });

  test('Debe rechazar creación de pictograma sin nombre', async () => {
    const datos = { nombre: '', url: 'http://img' } as any;
    await expect(facade.crearPictograma(datos)).rejects.toThrow();
  });

  test('Debe rechazar creación de pictograma con nombre nulo', async () => {
    const datos = { nombre: null as any, url: 'http://img' } as any;
    await expect(facade.crearPictograma(datos)).rejects.toThrow();
  });

  test('Debe eliminar pictograma y mensajes asociados', async () => {
    mockMensajeRepo.deleteByPictograma.mockResolvedValue(undefined);
    mockPictogramaRepo.delete.mockResolvedValue(undefined);

    await facade.eliminarPictograma(1);

    // la implementación actual elimina mensajes y luego el pictograma
    expect(mockMensajeRepo.deleteByPictograma).toHaveBeenCalledWith(1);
    expect(mockPictogramaRepo.delete).toHaveBeenCalledWith(1);
  });

  test('Eliminar pictograma inexistente no debe lanzar (comportamiento actual)', async () => {
    mockPictogramaRepo.getById.mockResolvedValue(null);
    mockMensajeRepo.deleteByPictograma.mockResolvedValue(undefined);
    mockPictogramaRepo.delete.mockResolvedValue(undefined);

    await facade.eliminarPictograma(999);

    expect(mockMensajeRepo.deleteByPictograma).toHaveBeenCalledWith(999);
    expect(mockPictogramaRepo.delete).toHaveBeenCalledWith(999);
  });

});
