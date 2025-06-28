export class InventarioResponse {
  id: number;
  idMedicamento: number;
  medicamento: string;
  idUsuario: number;
  username: string;
  idLugar: number;
  nombreLugar: string;
  descripcion: string;
  precio: number;
  cantidadAccion: number;
  cantidadTotal: number;
  fechaAccion: Date;
  fechaExpira: Date;
  acccion: string;

  constructor(
    id: number,
    idMedicamento: number,
    medicamento: string,
    idUsuario: number,
    username: string,
    idLugar: number,
    nombreLugar: string,
    descripcion: string,
    precio: number,
    cantidadAccion: number,
    cantidadTotal: number,
    fechaAccion: Date,
    fechaExpira: Date,
    acccion: string
  ) {
    this.id = id;
    this.idMedicamento = idMedicamento;
    this.medicamento = medicamento;
    this.idUsuario = idUsuario;
    this.username = username;
    this.idLugar = idLugar;
    this.nombreLugar = nombreLugar;
    this.descripcion = descripcion;
    this.precio = precio;
    this.cantidadAccion = cantidadAccion;
    this.cantidadTotal = cantidadTotal;
    this.fechaAccion = fechaAccion;
    this.fechaExpira = fechaExpira;
    this.acccion = acccion;
  }
}
