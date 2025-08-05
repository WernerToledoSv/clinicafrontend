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
  tipoconsulta?: string;  // nuevo
  tipopaciente?: string;  // nuevo
  estado?: string;        // nuevo

  constructor(
    id?: number,
    nombres?: string,
    apellidos?: string,
    edad?: number,
    sexo?: string,
    cel?: string,
    direccion?: string,
    idLugar?: number,
    nombreLugar?: string,
    tipoconsulta?: string,
    tipopaciente?: string,
    estado?: string
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
    this.tipoconsulta = tipoconsulta;
    this.tipopaciente = tipopaciente;
    this.estado = estado;
  }
}
