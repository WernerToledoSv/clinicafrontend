export class TipoMedidaResponse {
    id: number;
    nombre: string;
    abreviatura: string;
  
    constructor(id: number, nombre: string, abreviatura: string) {
      this.id = id;
      this.nombre = nombre;
      this.abreviatura = abreviatura;
    }
  }
  