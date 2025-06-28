export class MedicamentoResponse {
    id: number;
    idTipoMedida: number;
    idTipoMedicamento: number;
    tipoMedicamento: string;
    tipoMedida: string;
    nombre: string;
    descripcion: string;
    laboratorio: string;
    cantidad: number;
    valor: number;
    estado: string;

    constructor(
        id: number,
        idTipoMedida: number,
        idTipoMedicamento: number,
        tipoMedicamento: string,
        tipoMedida: string,
        nombre: string,
        descripcion: string,
        laboratorio: string,
        cantidad: number,
        valor: number,
        estado: string
    ) {
        this.id = id;
        this.idTipoMedida = idTipoMedida;
        this.idTipoMedicamento = idTipoMedicamento;
        this.tipoMedicamento = tipoMedicamento;
        this.tipoMedida = tipoMedida;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.laboratorio = laboratorio;
        this.cantidad = cantidad;
        this.valor = valor;
        this.estado = estado;
    }
}
