export class LugarEditarRequest {
  pId: number;
  pNombre: string;
  pFecha: string;      
  pHoraInicio: string;
  pHoraFin: string;

  constructor(
        pId: number,
        pNombre: string,
        pFecha: string,
        pHoraInicio: string,
        pHoraFin: string
    ) {
        this.pId = pId;
        this.pNombre = pNombre;
        this.pFecha = pFecha;
        this.pHoraInicio = pHoraInicio;
        this.pHoraFin = pHoraFin;
    }
}
