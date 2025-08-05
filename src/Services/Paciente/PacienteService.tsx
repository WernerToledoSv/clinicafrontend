import { PacienteRq } from "../../Interfaces/InterfacesResponse/Paciente/PacienteInterfase";
import { ListResponse } from "../../Interfaces/BaseResponse/ListResponse";
import { GenericResponse } from "../../Interfaces/BaseResponse/GenericResponse";

const userApiUrl = import.meta.env.VITE_USER_API;

export const ObtenerPacienteByIdLugar = async(idLugar: number): Promise<ListResponse<PacienteRq>> =>{
    const response = await fetch(`${userApiUrl}v1/Paciente/Listado-ByLugar?IdLugar=${idLugar}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    const res = await response.json();
    return new ListResponse<PacienteRq>(res.code, res.message, res.items);
}

export const ObtenerPacientebyNombre = async(nombre: string): Promise<ListResponse<PacienteRq>> =>{
    const response = await fetch(`${userApiUrl}v1/Paciente/Buscar-ByNombre?Nombre=s${nombre}`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    const res = await response.json();
    return new ListResponse<PacienteRq>(res.code, res.message, res.items);
}

export const AgregarPaciente = async(data: PacienteRq): Promise<GenericResponse> => {
    const response = await fetch(`${userApiUrl}v1/Paciente/Agregar`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return new GenericResponse(res.code, res.message);
}

export const EditarPaciente = async(data: PacienteRq): Promise<GenericResponse> => {
    const response = await fetch(`${userApiUrl}v1/Paciente/Editar`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const res = await response.json();
    return new GenericResponse(res.code, res.message);
}

export const CambiarEstadoPaciente = async (id: number): Promise<GenericResponse> => {
  const data = { id, estado: 'atendido' };

  const response = await fetch(`${userApiUrl}v1/Paciente/CambiarEstado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  return new GenericResponse(res.code, res.message);
};
