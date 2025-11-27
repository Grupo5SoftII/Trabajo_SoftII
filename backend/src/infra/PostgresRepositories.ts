import pool from "./db.js"; 
import {
  UsuarioRepo,
  AulaRepo,
  UsuarioAulaRepo,
  ChatRepo,
  PictogramaRepo,
  MensajePictogramaRepo,
  PictogramaInput
} from "./Repositories.js";

import { Usuario } from "../domain/Usuario.js";
import { Aula } from "../domain/Aula.js";
import { UsuarioAula } from "../domain/UsuarioAula.js";
import { Chat } from "../domain/Chat.js";
import { Pictograma } from "../domain/Pictograma.js";
import { MensajePictograma } from "../domain/MensajePictograma.js";

const mapUsuario = (row: any) => new Usuario(
    row.usuario_id, 
    row.nombre, 
    row.apellido, 
    row.edad, 
    row.tipo, 
    row.contraseña 
);

const mapAula = (row: any) => new Aula(
    row.aula_id,
    row.codigoaula,
    row.materia, 
    row.grado, 
    row.usuario_id
);

const mapUsuarioAula = (row: any) => new UsuarioAula(
    row.usuario_aula || 0, 
    row.usuario_id, 
    row.aula_id
);

const mapChat = (row: any) => new Chat(
    row.chat_id, 
    row.aula_id
);

const mapPictograma = (row: any) => new Pictograma(
    row.pictograma_id, 
    row.nombrepictograma 
);

const mapMensaje = (row: any) => new MensajePictograma(
    row.mensaje_id, 
    new Date(row.fecha), 
    row.usuario_id, 
    row.chat_id, 
    row.pictograma_id
);

export class PostgresUsuarioRepo implements UsuarioRepo {
  async listAll(): Promise<Usuario[]> {
    const { rows } = await pool.query("SELECT * FROM Usuario ORDER BY usuario_id");
    return rows.map(mapUsuario);
  }

  async getById(id: number): Promise<Usuario | undefined> {
    const { rows } = await pool.query("SELECT * FROM Usuario WHERE usuario_id = $1", [id]);
    return rows[0] ? mapUsuario(rows[0]) : undefined;
  }

  async add(data: Omit<Usuario, "id">): Promise<Usuario> {
    const { rows } = await pool.query(
      `INSERT INTO Usuario (nombre, apellido, edad, tipo, contraseña) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.nombre, data.apellido, data.edad, data.tipo, data.contrasena]
    );
    return mapUsuario(rows[0]);
  }

  async update(id: number, data: any): Promise<Usuario | undefined> { 
      throw new Error("Method not implemented."); 
  }
  
  async delete(id: number): Promise<boolean> { 
     const { rowCount } = await pool.query("DELETE FROM Usuario WHERE usuario_id = $1", [id]);
     return (rowCount ?? 0) > 0;
  }
}

export class PostgresAulaRepo implements AulaRepo {
  async listAll(): Promise<Aula[]> {
    const { rows } = await pool.query("SELECT * FROM Aula ORDER BY aula_id");
    return rows.map(mapAula);
  }

  async getById(id: number): Promise<Aula | undefined> {
    const { rows } = await pool.query("SELECT * FROM Aula WHERE aula_id = $1", [id]);
    return rows[0] ? mapAula(rows[0]) : undefined;
  }

  async add(data: { materia: string; grado: string; profesorId: number; codigo?: number }): Promise<Aula> {
    const codigo = data.codigo || Math.floor(1000 + Math.random() * 9000);
    const { rows } = await pool.query(
      `INSERT INTO Aula (codigoAula, materia, grado, usuario_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [codigo, data.materia, data.grado, data.profesorId]
    );
    return mapAula(rows[0]);
  }

  async update(id: number, data: any): Promise<Aula | undefined> { 
      throw new Error("Method not implemented."); 
  }
  
  async delete(id: number): Promise<boolean> { 
      throw new Error("Method not implemented."); 
  }
}

export class PostgresUsuarioAulaRepo implements UsuarioAulaRepo {
  async listAll(): Promise<UsuarioAula[]> {
    const { rows } = await pool.query("SELECT * FROM Usuario_aula");
    return rows.map(mapUsuarioAula);
  }

  async add(usuarioId: number, aulaId: number): Promise<UsuarioAula> {
    const existing = await this.findByUsuarioAndAula(usuarioId, aulaId);
    if (existing) return existing;

    const { rows } = await pool.query(
      `INSERT INTO Usuario_aula (usuario_id, aula_id) VALUES ($1, $2) RETURNING *`,
      [usuarioId, aulaId]
    );
    return mapUsuarioAula(rows[0]);
  }

  async findByUsuarioAndAula(usuarioId: number, aulaId: number): Promise<UsuarioAula | undefined> {
    const { rows } = await pool.query(
      "SELECT * FROM Usuario_aula WHERE usuario_id = $1 AND aula_id = $2",
      [usuarioId, aulaId]
    );
    return rows[0] ? mapUsuarioAula(rows[0]) : undefined;
  }

  async remove(usuarioId: number, aulaId: number): Promise<boolean> { 
      const { rowCount } = await pool.query("DELETE FROM Usuario_aula WHERE usuario_id = $1 AND aula_id = $2", [usuarioId, aulaId]);
      return (rowCount ?? 0) > 0;
  }
  
  async removeByUsuario(usuarioId: number): Promise<number> { return 0; }
  async removeByAula(aulaId: number): Promise<number> { return 0; }
}

export class PostgresChatRepo implements ChatRepo {
  async listAll(): Promise<Chat[]> {
    const { rows } = await pool.query("SELECT * FROM Chat");
    return rows.map(mapChat);
  }
  
  async getById(id: number): Promise<Chat | undefined> {
    const { rows } = await pool.query("SELECT * FROM Chat WHERE chat_id = $1", [id]);
    return rows[0] ? mapChat(rows[0]) : undefined;
  }

  async getByAulaId(aulaId: number): Promise<Chat | undefined> {
    const { rows } = await pool.query("SELECT * FROM Chat WHERE aula_id = $1", [aulaId]);
    return rows[0] ? mapChat(rows[0]) : undefined;
  }

  async add(data: Omit<Chat, "id">): Promise<Chat> {
    const { rows } = await pool.query("INSERT INTO Chat (aula_id) VALUES ($1) RETURNING *", [data.aulaId]);
    return mapChat(rows[0]);
  }

  async update(id: number, data: any): Promise<Chat | undefined> { 
      throw new Error("Method not implemented."); 
  }
  
  async delete(id: number): Promise<boolean> { 
    const { rowCount } = await pool.query("DELETE FROM Chat WHERE chat_id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}

export class PostgresPictogramaRepo implements PictogramaRepo {
  async listAll(): Promise<Pictograma[]> {
    const { rows } = await pool.query("SELECT * FROM Pictograma ORDER BY pictograma_id");
    return rows.map(mapPictograma);
  }

  async getById(id: number): Promise<Pictograma | undefined> {
    const { rows } = await pool.query("SELECT * FROM Pictograma WHERE pictograma_id = $1", [id]);
    return rows[0] ? mapPictograma(rows[0]) : undefined;
  }

  async add(data: PictogramaInput): Promise<Pictograma> {
    const { rows } = await pool.query(
      "INSERT INTO Pictograma (nombrePictograma) VALUES ($1) RETURNING *",
      [data.nombre]
    );
    return mapPictograma(rows[0]);
  }

  async update(id: number, data: any): Promise<Pictograma | undefined> { 
      throw new Error("Method not implemented."); 
  }
  
  async delete(id: number): Promise<boolean> { 
    const { rowCount } = await pool.query("DELETE FROM Pictograma WHERE pictograma_id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}

export class PostgresMensajePictogramaRepo implements MensajePictogramaRepo {
  async add(emisorId: number, chatId: number, pictogramaId: number): Promise<MensajePictograma> {
    const { rows } = await pool.query(
      `INSERT INTO Mensaje (usuario_id, chat_id, pictograma_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [emisorId, chatId, pictogramaId]
    );
    return mapMensaje(rows[0]);
  }

  async listByChat(chatId: number): Promise<MensajePictograma[]> {
    const { rows } = await pool.query(
      "SELECT * FROM Mensaje WHERE chat_id = $1 ORDER BY fecha ASC", 
      [chatId]
    );
    return rows.map(mapMensaje);
  }

  async getById(id: number): Promise<MensajePictograma | undefined> {
    const { rows } = await pool.query("SELECT * FROM Mensaje WHERE mensaje_id = $1", [id]);
    return rows[0] ? mapMensaje(rows[0]) : undefined;
  }
  
  async deleteByChat(chatId: number): Promise<number> {
      const { rowCount } = await pool.query("DELETE FROM Mensaje WHERE chat_id = $1", [chatId]);
      return rowCount ?? 0;
  }
  
  async deleteByEmisor(id: number): Promise<number> { return 0; }
  async deleteByPictograma(id: number): Promise<number> { return 0; }
  async update(id: number, data: any): Promise<MensajePictograma | undefined> { return undefined; }
  async delete(id: number): Promise<boolean> { return false; }
}