export class TipoMedidaRequest {
    pId?: number;
    pNombre?: string;
    pAbreviatura?: string;
  
    constructor(pId?:number, pNombre?: string, pAbreviatura?: string) {
      this.pId = pId;
      this.pNombre = pNombre;
      this.pAbreviatura = pAbreviatura;
    }
}
  