// MisionResponse.ts
export class MisionResponse {
    id: number;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
    mision: string;
    vision: string;
    estado: string;
  
    constructor(
      id: number = 0,
      nombre: string = '',
      fechaInicio: string = '',
      fechaFin: string = '',
      descripcion: string = '',
      mision: string = '',
      vision: string = '',
      estado: string = ''
    ) {
      this.id = id;
      this.nombre = nombre;
      this.fechaInicio = fechaInicio;
      this.fechaFin = fechaFin;
      this.descripcion = descripcion;
      this.mision = mision;
      this.vision = vision;
      this.estado = estado;
    }
}
  