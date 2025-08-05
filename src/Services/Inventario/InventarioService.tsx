import { ListResponse } from "../../Interfaces/BaseResponse/ListResponse";
import { GenericResponse } from "../../Interfaces/BaseResponse/GenericResponse";
import { InventarioRequest } from "../../Interfaces/InterfacesResponse/Inventario/InventarioRequest";
import { InventarioResponse } from "../../Interfaces/InterfacesResponse/Inventario/InventarioResponse";
import { InventarioStockResponse } from "../../Interfaces/InterfacesResponse/Inventario/InventarioStockResponse";

const UrlInventario = import.meta.env.VITE_INVENTARIO_API;

export const ObtenerStockInventario = async(): Promise<ListResponse<InventarioStockResponse>> =>{
    const response = await fetch(`${UrlInventario}v1/Inventario/Listado-Stock`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    const res = await response.json();
    return new ListResponse<InventarioStockResponse>(res.code, res.message, res.items);
}

export const ObtenerInventario = async(): Promise<ListResponse<InventarioResponse>> =>{
    const response = await fetch(`${UrlInventario}v1/Inventario/Listado-Inventario`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    const res = await response.json();
    return new ListResponse<InventarioResponse>(res.code, res.message, res.items);
}

export const AgregarInventario = async(data: InventarioRequest): Promise<GenericResponse> => {
    const response = await fetch(`${UrlInventario}v1/Inventario/Agregar`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return new GenericResponse(res.code, res.message);
}

export const AsignarLugar = async(data: InventarioRequest): Promise<GenericResponse> => {
    
    const response = await fetch(`${UrlInventario}v1/Inventario/Asignar-Lugar`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return new GenericResponse(res.code, res.message);
}

export const SalidaInventario = async(data: InventarioRequest): Promise<GenericResponse> => {

    const toQueryString = (data: Record<string, any>): string =>
        Object.entries(data)
            .filter(([key, value]) => 
            value !== undefined && 
            value !== null && 
            key !== 'fechaExpira' && 
            key !== 'precio'
            )
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');

    const dataQuery = toQueryString(data);
    const response = await fetch(`${UrlInventario}v1/Inventario/Salida-Medicamento?${dataQuery}`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    const res = await response.json();
    return new GenericResponse(res.code, res.message);
}
export const CargarInventarioLugar = async(idLugar: number): Promise<ListResponse<InventarioStockResponse>> => {
    const response = await fetch(`${UrlInventario}v1/Inventario/Listado-Stock-Lugar?idLugar=${idLugar}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const res = await response.json();
    return new ListResponse<InventarioStockResponse>(res.code, res.message, res.items);
};

export const ActualizarInventario = async(data: InventarioResponse): Promise<GenericResponse> => {
    const response = await fetch(`${UrlInventario}v1/Inventario/Actualizar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return new GenericResponse(res.code, res.message);
};


