export class RolRequest{
    pNombre: string;
    pDescripcion: string;

    constructor(Nombre: string, Descripcion: string){
        this.pNombre = Nombre;
        this.pDescripcion = Descripcion;
    }
}