export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public edad: number,
    public tipo: string // "PROFESOR" | "ALUMNO"
  ) {}
}
