export class InventarioRequest {
  idMedicamento?: number;
  idProveedor?: number;
  idInsumoMedico?: number;
  idUsuario?: number;
  idMedico?: number;
  idEnfermero?: number;
  idReceta?: number;
  idLugar?: number;
  descripcion?: string;
  precio?: number;
  cantidadAccion?: number;
  cantidadTotal?: number;
  fechaExpira?: Date;

  constructor(
    idMedicamento?: number,
    idProveedor?: number,
    idInsumoMedico?: number,
    idUsuario?: number,
    idMedico?: number,
    idEnfermero?: number,
    idReceta?: number,
    idLugar?: number,
    descripcion?: string,
    precio?: number,
    cantidadAccion?: number,
    cantidadTotal?:number,
    fechaExpira?: Date
  ) {
    this.idMedicamento = idMedicamento;
    this.idProveedor = idProveedor;
    this.idInsumoMedico = idInsumoMedico;
    this.idUsuario = idUsuario;
    this.idMedico = idMedico;
    this.idEnfermero = idEnfermero;
    this.idReceta = idReceta;
    this.idLugar = idLugar;
    this.descripcion = descripcion;
    this.precio = precio;
    this.cantidadAccion = cantidadAccion;
    this.cantidadTotal = cantidadTotal;
    this.fechaExpira = fechaExpira;
  }
}
