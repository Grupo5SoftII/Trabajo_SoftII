// tests/unit/usuarioAula/desasignar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - UsuarioAula: Desasignar', () => {
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

  test('Debería desasignar un usuario de un aula', async () => {
    mocks.usuarioAula.remove.mockResolvedValue(undefined);

    await facade.desasignarUsuarioAAula(1, 1);

    expect(mocks.usuarioAula.remove).toHaveBeenCalledWith(1, 1);
  });

  test('Debería permitir desasignar múltiples usuarios de una aula', async () => {
    mocks.usuarioAula.remove.mockResolvedValue(undefined);

    await facade.desasignarUsuarioAAula(1, 1);
    await facade.desasignarUsuarioAAula(2, 1);
    await facade.desasignarUsuarioAAula(3, 1);

    expect(mocks.usuarioAula.remove).toHaveBeenCalledTimes(3);
    expect(mocks.usuarioAula.remove).toHaveBeenLastCalledWith(3, 1);
  });

  test('Debería permitir desasignar un usuario de múltiples aulas', async () => {
    mocks.usuarioAula.remove.mockResolvedValue(undefined);

    await facade.desasignarUsuarioAAula(1, 1);
    await facade.desasignarUsuarioAAula(1, 2);
    await facade.desasignarUsuarioAAula(1, 3);

    expect(mocks.usuarioAula.remove).toHaveBeenCalledTimes(3);
    expect(mocks.usuarioAula.remove).toHaveBeenLastCalledWith(1, 3);
  });
});
