import { useQuery } from '@tanstack/react-query';
import { ObtenerLugares } from '../../Services/Lugar/LugarService';
import { ListResponse } from '../../Interfaces/BaseResponse/ListResponse';
import { LugarResponse } from '../../Interfaces/InterfacesResponse/Lugar/LugarResponse';


export const useObtenerLugares = () => {
  return useQuery<ListResponse<LugarResponse>, Error>({
    queryKey: ['lugares'],
    queryFn: ObtenerLugares,
  });
};
