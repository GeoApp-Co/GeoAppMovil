import { isAxiosError } from "axios"
import api from "../lib/axios"
import { paginationManifestSchema } from "../schema/manifestSchema"


type ManifestType = {
    page: number
    limit: number
    clientId?: string
    manifestTemplate?: string,
    estado?: string
    fecha?: string
    code: string
    manifestId: string
} 

export async function getManifest( {  limit, page, estado, clientId, fecha, manifestTemplate } : Pick<ManifestType, 'estado' | 'limit' | 'page' | 'clientId' | 'fecha' | 'manifestTemplate'>) {
    try {
        const url = '/manifests'
        const { data } = await api.get(url, {
            params: {
                page,
                limit,
                clientId,
                manifestTemplate,
                estado,
                fecha
            }
        }) 

        const response = paginationManifestSchema.safeParse(data)
        
        if (response.success) {
            return response.data
        } else { 
            return {
                manifests: [],
                total: 0,
                totalPages: 0,
                currentPage: 1
            }
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}