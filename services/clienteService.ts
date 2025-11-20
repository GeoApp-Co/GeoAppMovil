import { isAxiosError } from "axios"
import api from "../lib/axios"
import { paginationClientesSchema } from "../schema/clienteSchema"

type ClienteType = {
    search?: string,
    limit?: number, 
    page?: number,
}

export async function getSelectClient( { search, limit, page  } : Pick<ClienteType, 'search' | 'limit' | 'page'> ) {
    try {
        const url = '/clientes/select'
        const {data} = await api.get(url, {
            params: {
                search,
                limit,
                page,
            }
        })

        const response = paginationClientesSchema.safeParse(data)
        console.log(response.error);
        
        

        if (response.success) {
            return response.data
        }

        
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}