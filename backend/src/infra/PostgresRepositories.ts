import { pool } from "./PostgresClient.js";
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

const mapUsuario = (row: any) => new Usuario(row.id, row.nombre, row.apellidos, row.edad, row.tipo, row.usuario);
const mapAula = (row: any) => new Aula(row.id, row.nombre, row.grado, row.profesor_encargado);
const mapUsuarioAula = (row: any) => new UsuarioAula(row.id, row.usuario_id, row.aula_id);
const mapChat = (row: any) => new Chat(row.id, row.tipo, row.aula_id);
const mapPictograma = (row: any) => new Pictograma(row.id, row.url, row.titulo);
const mapMensaje = (row: any) =>
  new MensajePictograma(row.id, new Date(row.fecha), row.emisor_id, row.chat_id, row.pictograma_id);

export class PostgresUsuarioRepo implements UsuarioRepo {
  async listAll() {
    const { rows } = await pool.query("SELECT id, nombre, apellidos, edad, tipo, usuario FROM usuarios ORDER BY id");
    return rows.map(mapUsuario);
  }

  async getById(id: number) {
    const { rows } = await pool.query("SELECT id, nombre, edad, tipo FROM usuarios WHERE id = $1", [id]);
    return rows[0] ? mapUsuario(rows[0]) : undefined;
  }

  async add(data: Omit<Usuario, "id">) {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre, edad, tipo) VALUES ($1, $2, $3) RETURNING id, nombre, edad, tipo",
      [data.nombre, data.edad, data.tipo]
    );
    return mapUsuario(rows[0]);
  }

  async update(id: number, data: Partial<Omit<Usuario, "id">>) {
    const { rows } = await pool.query(
      `UPDATE usuarios
       SET nombre = COALESCE($2, nombre),
           edad = COALESCE($3, edad),
           tipo = COALESCE($4, tipo)
       WHERE id = $1
       RETURNING id, nombre, edad, tipo`,
      [id, data.nombre ?? null, data.edad ?? null, data.tipo ?? null]
    );
    return rows[0] ? mapUsuario(rows[0]) : undefined;
  }

  async delete(id: number) {
    const { rowCount } = await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}

export class PostgresAulaRepo implements AulaRepo {
  async listAll() {
    const { rows } = await pool.query(
      "SELECT id, nombre, grado, profesor_encargado FROM aulas ORDER BY id"
    );
    return rows.map(mapAula);
  }

  async getById(id: number) {
    const { rows } = await pool.query(
      "SELECT id, nombre, grado, profesor_encargado FROM aulas WHERE id = $1",
      [id]
    );
    return rows[0] ? mapAula(rows[0]) : undefined;
  }

  async add(data: Omit<Aula, "id">) {
    const { rows } = await pool.query(
      `INSERT INTO aulas (nombre, grado, profesor_encargado)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, grado, profesor_encargado`,
      [data.nombre, data.grado, data.profesorEncargado]
    );
    return mapAula(rows[0]);
  }

  async update(id: number, data: Partial<Omit<Aula, "id">>) {
    const { rows } = await pool.query(
      `UPDATE aulas
       SET nombre = COALESCE($2, nombre),
           grado = COALESCE($3, grado),
           profesor_encargado = COALESCE($4, profesor_encargado)
       WHERE id = $1
       RETURNING id, nombre, grado, profesor_encargado`,
      [id, data.nombre ?? null, data.grado ?? null, data.profesorEncargado ?? null]
    );
    return rows[0] ? mapAula(rows[0]) : undefined;
  }

  async delete(id: number) {
    const { rowCount } = await pool.query("DELETE FROM aulas WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}

export class PostgresUsuarioAulaRepo implements UsuarioAulaRepo {
  async listAll() {
    const { rows } = await pool.query(
      "SELECT id, usuario_id, aula_id FROM usuario_aula ORDER BY id"
    );
    return rows.map(mapUsuarioAula);
  }

  async add(usuarioId: number, aulaId: number) {
    const { rows } = await pool.query(
      `INSERT INTO usuario_aula (usuario_id, aula_id)
       VALUES ($1, $2)
       ON CONFLICT (usuario_id, aula_id) DO NOTHING
       RETURNING id, usuario_id, aula_id`,
      [usuarioId, aulaId]
    );
    if (!rows[0]) {
      const existing = await this.findByUsuarioAndAula(usuarioId, aulaId);
      if (!existing) throw new Error("No se pudo crear la inscripcion usuario/aula");
      return existing;
    }
    return mapUsuarioAula(rows[0]);
  }

  async findByUsuarioAndAula(usuarioId: number, aulaId: number) {
    const { rows } = await pool.query(
      "SELECT id, usuario_id, aula_id FROM usuario_aula WHERE usuario_id = $1 AND aula_id = $2 LIMIT 1",
      [usuarioId, aulaId]
    );
    return rows[0] ? mapUsuarioAula(rows[0]) : undefined;
  }

  async remove(usuarioId: number, aulaId: number) {
    const { rowCount } = await pool.query(
      "DELETE FROM usuario_aula WHERE usuario_id = $1 AND aula_id = $2",
      [usuarioId, aulaId]
    );
    return (rowCount ?? 0) > 0;
  }

  async removeByUsuario(usuarioId: number) {
    const { rowCount } = await pool.query("DELETE FROM usuario_aula WHERE usuario_id = $1", [
      usuarioId
    ]);
    return rowCount ?? 0;
  }

  async removeByAula(aulaId: number) {
    const { rowCount } = await pool.query("DELETE FROM usuario_aula WHERE aula_id = $1", [aulaId]);
    return rowCount ?? 0;
  }
}

export class PostgresChatRepo implements ChatRepo {
  async listAll() {
    const { rows } = await pool.query("SELECT id, tipo, aula_id FROM chats ORDER BY id");
    return rows.map(mapChat);
  }

  async getById(id: number) {
    const { rows } = await pool.query("SELECT id, tipo, aula_id FROM chats WHERE id = $1", [id]);
    return rows[0] ? mapChat(rows[0]) : undefined;
  }

  async getByAulaId(aulaId: number) {
    const { rows } = await pool.query("SELECT id, tipo, aula_id FROM chats WHERE aula_id = $1", [
      aulaId
    ]);
    return rows[0] ? mapChat(rows[0]) : undefined;
  }

  async add(data: Omit<Chat, "id">) {
    const { rows } = await pool.query(
      `INSERT INTO chats (tipo, aula_id)
       VALUES ($1, $2)
       RETURNING id, tipo, aula_id`,
      [data.tipo, data.aulaId]
    );
    return mapChat(rows[0]);
  }

  async update(id: number, data: Partial<Omit<Chat, "id">>) {
    const { rows } = await pool.query(
      `UPDATE chats
       SET tipo = COALESCE($2, tipo),
           aula_id = COALESCE($3, aula_id)
       WHERE id = $1
       RETURNING id, tipo, aula_id`,
      [id, data.tipo ?? null, data.aulaId ?? null]
    );
    return rows[0] ? mapChat(rows[0]) : undefined;
  }

  async delete(id: number) {
    const { rowCount } = await pool.query("DELETE FROM chats WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}

export class PostgresPictogramaRepo implements PictogramaRepo {
  async listAll() {
    const { rows } = await pool.query("SELECT id, url, titulo FROM pictogramas ORDER BY id");
    return rows.map(mapPictograma);
  }

  async getById(id: number) {
    const { rows } = await pool.query("SELECT id, url, titulo FROM pictogramas WHERE id = $1", [
      id
    ]);
    return rows[0] ? mapPictograma(rows[0]) : undefined;
  }

  async add(data: PictogramaInput) {
    const hasId = data.id !== undefined && data.id !== null;
    const query = hasId
      ? `INSERT INTO pictogramas (id, url, titulo)
         VALUES ($1, $2, $3)
         RETURNING id, url, titulo`
      : `INSERT INTO pictogramas (url, titulo)
         VALUES ($1, $2)
         RETURNING id, url, titulo`;

    const params = hasId ? [data.id, data.url, data.titulo] : [data.url, data.titulo];
    const { rows } = await pool.query(query, params);
    return mapPictograma(rows[0]);
  }

  async update(id: number, data: Partial<Omit<Pictograma, "id">>) {
    const { rows } = await pool.query(
      `UPDATE pictogramas
       SET url = COALESCE($2, url),
           titulo = COALESCE($3, titulo)
       WHERE id = $1
       RETURNING id, url, titulo`,
      [id, data.url ?? null, data.titulo ?? null]
    );
    return rows[0] ? mapPictograma(rows[0]) : undefined;
  }

  async delete(id: number) {
    const { rowCount } = await pool.query("DELETE FROM pictogramas WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}

export class PostgresMensajePictogramaRepo implements MensajePictogramaRepo {
  async add(emisorId: number, chatId: number, pictogramaId: number) {
    const { rows } = await pool.query(
      `INSERT INTO mensajes (emisor_id, chat_id, pictograma_id)
       VALUES ($1, $2, $3)
       RETURNING id, fecha, emisor_id, chat_id, pictograma_id`,
      [emisorId, chatId, pictogramaId]
    );
    return mapMensaje(rows[0]);
  }

  async listByChat(chatId: number) {
    const { rows } = await pool.query(
      `SELECT id, fecha, emisor_id, chat_id, pictograma_id
       FROM mensajes
       WHERE chat_id = $1
       ORDER BY fecha ASC, id ASC`,
      [chatId]
    );
    return rows.map(mapMensaje);
  }

  async getById(id: number) {
    const { rows } = await pool.query(
      "SELECT id, fecha, emisor_id, chat_id, pictograma_id FROM mensajes WHERE id = $1",
      [id]
    );
    return rows[0] ? mapMensaje(rows[0]) : undefined;
  }

  async update(
    id: number,
    data: Partial<Pick<MensajePictograma, "emisorId" | "pictogramaId">>
  ) {
    const { rows } = await pool.query(
      `UPDATE mensajes
       SET emisor_id = COALESCE($2, emisor_id),
           pictograma_id = COALESCE($3, pictograma_id)
       WHERE id = $1
       RETURNING id, fecha, emisor_id, chat_id, pictograma_id`,
      [id, data.emisorId ?? null, data.pictogramaId ?? null]
    );
    return rows[0] ? mapMensaje(rows[0]) : undefined;
  }

  async delete(id: number) {
    const { rowCount } = await pool.query("DELETE FROM mensajes WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }

  async deleteByChat(chatId: number) {
    const { rowCount } = await pool.query("DELETE FROM mensajes WHERE chat_id = $1", [chatId]);
    return rowCount ?? 0;
  }

  async deleteByEmisor(emisorId: number) {
    const { rowCount } = await pool.query("DELETE FROM mensajes WHERE emisor_id = $1", [emisorId]);
    return rowCount ?? 0;
  }

  async deleteByPictograma(pictogramaId: number) {
    const { rowCount } = await pool.query("DELETE FROM mensajes WHERE pictograma_id = $1", [
      pictogramaId
    ]);
    return rowCount ?? 0;
  }
}
