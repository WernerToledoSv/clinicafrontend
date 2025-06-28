export class InventarioStockResponse {
  nombreMedicamento: string;
  descripcionMedicamento: string;
  laboratorio: string;
  estado: string;
  valor: number;
  medida: string;
  tipoMedicamento: string;
  nombreLugar: string;
  stock: number;

  constructor(
    nombreMedicamento: string,
    descripcionMedicamento: string,
    laboratorio: string,
    estado: string,
    valor: number,
    medida: string,
    tipoMedicamento: string,
    nombreLugar:string,
    stock: number
  ) {
    this.nombreMedicamento = nombreMedicamento;
    this.descripcionMedicamento = descripcionMedicamento;
    this.laboratorio = laboratorio;
    this.estado = estado;
    this.valor = valor;
    this.medida = medida;
    this.tipoMedicamento = tipoMedicamento;
    this.nombreLugar = nombreLugar;
    this.stock = stock;
  }
}
