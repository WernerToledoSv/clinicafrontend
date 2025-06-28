// LugarRequest.ts
export class LugarRequest {
    pNombre: string;
    pFecha: string;
    pHoraInicio: string;
    pHoraFin: string;
  
    constructor() {
      this.pNombre = '';
      this.pFecha = new Date().toISOString();
      this.pHoraInicio = '';
      this.pHoraFin = '';
    }
  }
  