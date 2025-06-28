export class UsuarioResponse {
  id: number;
  idRol: number;  // Cambio a camelCase
  idLugar: number;  // Cambio a camelCase
  rol: string;
  lugar: string;
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  sexo: string;
  cel: string;
  email: string;
  fechaIngreso: string; // Cambio a camelCase
  estado: string;

  constructor(
    id: number,
    rol: string,
    lugar: string,
    username: string,
    password: string,
    nombres: string,
    apellidos: string,
    sexo: string,
    cel: string,
    email: string,
    fechaIngreso: string, // Cambio a camelCase
    estado: string,
    idRol: number,  // Cambio a camelCase
    idLugar: number  // Cambio a camelCase
  ) {
    this.id = id;
    this.rol = rol;
    this.lugar = lugar;
    this.username = username;
    this.password = password;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.sexo = sexo;
    this.cel = cel;
    this.email = email;
    this.fechaIngreso = fechaIngreso;
    this.estado = estado;
    this.idLugar = idLugar;
    this.idRol = idRol;
  }
}
