// tests/unit/mensajes/listar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Mensajes: Listar', () => {
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

  test('Debería listar todos los mensajes de un chat', async () => {
    const mensajes = [
      { id: 1, chatId: 1, emisorId: 1, pictogramaId: 1, timestamp: new Date() },
      { id: 2, chatId: 1, emisorId: 2, pictogramaId: 2, timestamp: new Date() }
    ];

    mocks.mensajes.listByChat.mockResolvedValue(mensajes);
    const resultado = await facade.listarMensajes(1);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].chatId).toBe(1);
    expect(mocks.mensajes.listByChat).toHaveBeenCalledWith(1);
  });

  test('Debería retornar lista vacía si no hay mensajes en el chat', async () => {
    mocks.mensajes.listByChat.mockResolvedValue([]);
    const resultado = await facade.listarMensajes(1);

    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });

  test('Debería listar mensajes de diferentes chats de forma independiente', async () => {
    const mensajesChat1 = [
      { id: 1, chatId: 1, emisorId: 1, pictogramaId: 1, timestamp: new Date() }
    ];
    const mensajesChat2 = [
      { id: 2, chatId: 2, emisorId: 2, pictogramaId: 2, timestamp: new Date() }
    ];

    mocks.mensajes.listByChat
      .mockResolvedValueOnce(mensajesChat1)
      .mockResolvedValueOnce(mensajesChat2);

    const resultado1 = await facade.listarMensajes(1);
    const resultado2 = await facade.listarMensajes(2);

    expect(resultado1[0].chatId).toBe(1);
    expect(resultado2[0].chatId).toBe(2);
  });
});
