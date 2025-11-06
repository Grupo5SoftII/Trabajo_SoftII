import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { UsuarioAula } from "../domain/UsuarioAula.js";
import { Chat } from "../domain/Chat.js";
import { Pictograma } from "../domain/Pictograma.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";

export class DatabaseSingleton {
  private static instance: DatabaseSingleton;

  // “Tablas” en memoria
  public usuarios: Usuario[] = [];
  public aulas: Aula[] = [];
  public usuarioAula: UsuarioAula[] = [];
  public chats: Chat[] = [];
  public pictogramas: Pictograma[] = [];
  public mensajes: MensajePictograma[] = [];

  private constructor() {}

  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  public nextId(arr: { id: number }[]): number {
    return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
  }
}
