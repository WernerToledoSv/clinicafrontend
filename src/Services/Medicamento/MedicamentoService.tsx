import { ListResponse } from "../../Interfaces/BaseResponse/ListResponse";
import { MedicamentoResponse } from "../../Interfaces/InterfacesResponse/Medicamento/MedicamentoResponse";

const UrlInventario = import.meta.env.VITE_INVENTARIO_API;


export const obtenerMedicamento = async (): Promise<ListResponse<MedicamentoResponse>> => {
  const response = await fetch(`${UrlInventario}v1/Medicamento/Listado`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los tipos de medicamento');
  }

  const res = await response.json();
  return new ListResponse<MedicamentoResponse>(res.code, res.message, res.items);
};