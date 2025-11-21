export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public apellidos: string,
    public edad: number,
    public tipo: string, // "PROFESOR" | "ALUMNO"
    public usuario: string
  ) {}
}
