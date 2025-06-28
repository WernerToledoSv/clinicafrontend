export class TipoMedicamentoRequest {
    pId?: number;
    pNombre?: string;
    pDescripcion?: string;
  
    constructor(pId?:number, pNombre?: string, pDescripcion?: string) {
      this.pId = pId;
      this.pNombre = pNombre;
      this.pDescripcion = pDescripcion;
    }
}
  