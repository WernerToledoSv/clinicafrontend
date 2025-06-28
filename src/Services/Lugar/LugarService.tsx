import { LugarRequest } from "../../Interfaces/InterfacesResponse/Lugar/LugarRequest";
import { LugarResponse } from "../../Interfaces/InterfacesResponse/Lugar/LugarResponse";
import { ObjectResponse } from "../../Interfaces/BaseResponse/ObjectResponse";
import { ListResponse } from "../../Interfaces/BaseResponse/ListResponse";

const userApiUrl = import.meta.env.VITE_USER_API;


export const CrearLugar = async (
  data: LugarRequest
): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Agregar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error en la creación del lugar');

  const res = await response.json();
  return new ObjectResponse<LugarResponse>(res.code, res.message, res.item);
};

export const ObtenerLugares = async (): Promise<ListResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Error al obtener los lugares');

  const res = await response.json();
  return new ListResponse<LugarResponse>(res.code, res.message, res.items);
};

// Eliminar lugar
export const EliminarLugar = async (
  pId: number
): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Eliminar`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pId }),
  });

  if (!response.ok) throw new Error('Error al eliminar el lugar');

  const data = await response.json();
  return new ObjectResponse<LugarResponse>(data.code, data.message, data.item);
};

// Activar lugar
export const ActivarLugar = async (
  pId: number
): Promise<ObjectResponse<LugarResponse>> => {
  const response = await fetch(`${userApiUrl}v1/Lugar/Activar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pId }),
  });

  if (!response.ok) throw new Error('Error al activar el lugar');

  const data = await response.json();
  return new ObjectResponse<LugarResponse>(data.code, data.message, data.item);
};