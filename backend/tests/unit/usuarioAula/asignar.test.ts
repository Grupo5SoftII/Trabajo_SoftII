// tests/unit/usuarioAula/asignar.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - UsuarioAula: Asignar', () => {
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

  test('Debería asignar un usuario a un aula', async () => {
    mocks.usuarioAula.add.mockResolvedValue(undefined);

    await facade.asignarUsuarioAAula(1, 1);

    expect(mocks.usuarioAula.add).toHaveBeenCalledWith(1, 1);
  });

  test('Debería permitir asignar múltiples usuarios a una aula', async () => {
    mocks.usuarioAula.add.mockResolvedValue(undefined);

    await facade.asignarUsuarioAAula(1, 1);
    await facade.asignarUsuarioAAula(2, 1);
    await facade.asignarUsuarioAAula(3, 1);

    expect(mocks.usuarioAula.add).toHaveBeenCalledTimes(3);
    expect(mocks.usuarioAula.add).toHaveBeenCalledWith(3, 1);
  });

  test('Debería permitir asignar un usuario a múltiples aulas', async () => {
    mocks.usuarioAula.add.mockResolvedValue(undefined);

    await facade.asignarUsuarioAAula(1, 1);
    await facade.asignarUsuarioAAula(1, 2);
    await facade.asignarUsuarioAAula(1, 3);

    expect(mocks.usuarioAula.add).toHaveBeenCalledTimes(3);
    expect(mocks.usuarioAula.add).toHaveBeenLastCalledWith(1, 3);
  });
});
