// UnionMisionLugarResponse.ts
export class UnionMisionLugarResponse {
  id: number;
  mision: string;
  fechaInicioMision: string;
  fechaFinMision: string;
  fechaLugar: string;
  descripcion: string;
  lugar: string;
  horaInicio: string;
  horaFin: string;

  constructor(
    id: number,
    mision: string,
    fechaInicioMision: string,
    fechaFinMision: string,
    fechaLugar: string,
    descripcion: string,
    lugar: string,
    horaInicio: string,
    horaFin: string
  ) {
    this.id = id;
    this.mision = mision;
    this.fechaInicioMision = fechaInicioMision;
    this.fechaFinMision = fechaFinMision;
    this.fechaLugar = fechaLugar;
    this.descripcion = descripcion;
    this.lugar = lugar;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }
}
