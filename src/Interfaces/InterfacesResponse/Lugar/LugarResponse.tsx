// LugarResponse.ts
export class LugarResponse {
    id: number;
    nombre: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
  
    constructor() {
      this.id = 0;
      this.nombre = '';
      this.fecha = new Date().toISOString();
      this.horaInicio = '';
      this.horaFin = '';
      this.estado = '';
    }
  }
  