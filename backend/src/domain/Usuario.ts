export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public edad: number,
    public tipo: string,
    public contrasena: string
  ) {}
}
