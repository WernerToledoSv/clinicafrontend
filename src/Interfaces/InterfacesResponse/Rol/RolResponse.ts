export class RolResponse{
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;

    constructor(Id: number, Nombre: string, Descripcion: string, Estado: string){
        this.id = Id;
        this.nombre = Nombre;
        this.descripcion = Descripcion;
        this.estado = Estado;
    }
}