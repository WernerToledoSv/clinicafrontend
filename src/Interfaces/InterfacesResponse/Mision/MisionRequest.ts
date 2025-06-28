// MisionRequest.ts
export class MisionRequest {
    pNombre: string;
    pFechaInicio: string;
    pFechaFin: string;
    pDescripcion: string;
    pMision: string;
    pVision: string;
  
    constructor() {
      this.pNombre = '';
      this.pFechaInicio = new Date().toISOString();
      this.pFechaFin = new Date().toISOString();
      this.pDescripcion = '';
      this.pMision = '';
      this.pVision = '';
    }
  }
  