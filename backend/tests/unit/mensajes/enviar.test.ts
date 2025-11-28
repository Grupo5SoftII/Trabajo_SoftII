// tests/unit/mensajes/enviar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Mensajes: Enviar', () => {
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

  test('Debería enviar pictograma a un chat', async () => {
    const nuevoMensaje = {
      id: 1,
      chatId: 1,
      emisorId: 1,
      pictogramaId: 1,
      timestamp: new Date()
    };

    mocks.mensajes.add.mockResolvedValue(nuevoMensaje);
    const resultado = await facade.enviarPictograma(1, 1, 1);

    expect(resultado).toEqual(nuevoMensaje);
    expect(resultado.chatId).toBe(1);
    expect(mocks.mensajes.add).toHaveBeenCalledWith(1, 1, 1);
  });

  test('Debería permitir enviar múltiples pictogramas al mismo chat', async () => {
    const mensaje1 = { id: 1, chatId: 1, emisorId: 1, pictogramaId: 1, timestamp: new Date() };
    const mensaje2 = { id: 2, chatId: 1, emisorId: 1, pictogramaId: 2, timestamp: new Date() };

    mocks.mensajes.add.mockResolvedValueOnce(mensaje1).mockResolvedValueOnce(mensaje2);
    const resultado1 = await facade.enviarPictograma(1, 1, 1);
    const resultado2 = await facade.enviarPictograma(1, 1, 2);

    expect(resultado1.id).toBe(1);
    expect(resultado2.id).toBe(2);
    expect(mocks.mensajes.add).toHaveBeenCalledTimes(2);
  });
});
