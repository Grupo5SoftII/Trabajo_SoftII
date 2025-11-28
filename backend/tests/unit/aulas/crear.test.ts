// tests/unit/aulas/crear.test.ts

import { PictotapFacade } from '../../../src/services/PictotapFacade';
import { createMockRepos, resetAll } from '../../mocks/backendMocks';

describe('PictotapFacade - Aulas: Crear', () => {
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

  test('Debería crear aula con materia obligatoria', async () => {
    const nuevaAula = { materia: 'Matemática', grado: '1', profesorEncargado: 1 };
    const aulaCreada = { id: 1, codigo: 1, materia: 'Matemática', grado: '1', profesorId: 1 };

    mocks.aulas.add.mockResolvedValue(aulaCreada);
    const resultado = await facade.crearAula(nuevaAula);

    expect(resultado.materia).toBe('Matemática');
    expect(mocks.aulas.add).toHaveBeenCalled();
  });

  test('Debería lanzar error si falta materia en creación de aula', async () => {
    const datosIncompletos = { grado: '1', profesorId: 1 };

    await expect(facade.crearAula(datosIncompletos)).rejects.toThrow('Materia obligatoria');
  });

  test('Debería usar grado por defecto si no se proporciona', async () => {
    const datos = { materia: 'Ciencias' };
    const aulaCreada = { id: 3, codigo: 3, materia: 'Ciencias', grado: 'General', profesorId: 0 };

    mocks.aulas.add.mockResolvedValue(aulaCreada);
    const resultado = await facade.crearAula(datos);

    expect(resultado.grado).toBe('General');
  });

  test('Debería rechazar aula con materia vacía', async () => {
    const datosInvalidos = { materia: '' };

    await expect(facade.crearAula(datosInvalidos)).rejects.toThrow('Materia obligatoria');
  });
});
