export class MisionEditarRequest {
  pId: number;
  pNombre: string;
  pFechaInicio: string; 
  pFechaFin: string;    
  pDescripcion: string;
  pMision: string;
  pVision: string;

  constructor(
    pId: number,
    pNombre: string,
    pFechaInicio: string,
    pFechaFin: string,
    pDescripcion: string,
    pMision: string,
    pVision: string
  ) {
    this.pId = pId;
    this.pNombre = pNombre;
    this.pFechaInicio = pFechaInicio;
    this.pFechaFin = pFechaFin;
    this.pDescripcion = pDescripcion;
    this.pMision = pMision;
    this.pVision = pVision;
  }
}
