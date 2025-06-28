export class MedicamentoRequest {
    pId?:number;
    pIdTipoMedida?: number;
    pIdTipoMedicamento?: number;
    pNombre: string;
    pDescripcion?: string;
    pLaboratorio: string;
    pCantidad?: number;
    pValor?: number;
  
    constructor(
      pId?:number,
      pIdTipoMedida?: number,
      pIdTipoMedicamento?: number,
      pNombre: string = '',
      pDescripcion?: string,
      pLaboratorio: string = '',
      pCantidad?: number,
      pValor?: number
    ) {
      this.pId = pId;
      this.pIdTipoMedida = pIdTipoMedida;
      this.pIdTipoMedicamento = pIdTipoMedicamento;
      this.pNombre = pNombre;
      this.pDescripcion = pDescripcion;
      this.pLaboratorio = pLaboratorio;
      this.pCantidad = pCantidad;
      this.pValor = pValor;
    }
  }
  