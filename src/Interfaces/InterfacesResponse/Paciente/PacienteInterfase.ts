export class PacienteRq {
  id?: number;
  nombres?: string;
  apellidos?: string;
  edad?: number;
  sexo?: string;
  cel?: string;
  direccion?: string;
  idLugar?: number;
  nombreLugar?: string;

  constructor(
    id?: number,
    nombres?: string,
    apellidos?: string,
    edad?: number,
    sexo?: string,
    cel?: string,
    direccion?: string,
    idLugar?: number,
    nombreLugar?: string
  ) {
    this.id = id;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.edad = edad;
    this.sexo = sexo;
    this.cel = cel;
    this.direccion = direccion;
    this.idLugar = idLugar;
    this.nombreLugar = nombreLugar;
  }
}
