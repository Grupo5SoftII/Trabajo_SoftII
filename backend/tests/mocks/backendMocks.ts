// tests/mocks/backendMocks.ts

export function createMockRepos() {
  const usuarios = {
    listAll: jest.fn(),
    getById: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
  };

  const aulas = {
    listAll: jest.fn(),
    getById: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
  };

  const usuarioAula = {
    listAll: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    removeByUsuario: jest.fn(),
    removeByAula: jest.fn(),
  };

  const chats = {
    listAll: jest.fn(),
    getById: jest.fn(),
    getByAulaId: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
  };

  const pictos = {
    listAll: jest.fn(),
    getById: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
  };

  const mensajes = {
    listByChat: jest.fn(),
    add: jest.fn(),
    delete: jest.fn(),
    deleteByChat: jest.fn(),
    deleteByEmisor: jest.fn(),
    deleteByPictograma: jest.fn(),
  };

  return { usuarios, aulas, usuarioAula, chats, pictos, mensajes };
}

export function resetAll(mocksObj: any) {
  Object.values(mocksObj).forEach((repo: any) => {
    Object.values(repo).forEach((fn: any) => {
      if (fn && fn.mockClear) fn.mockClear();
    });
  });
}
