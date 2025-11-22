export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public apellidos: string,
    public edad: number,
    public tipo: 'PROFESOR' | 'ALUMNO',
    public usuario: string,
    public contrasena: string 
  ) {}
}
