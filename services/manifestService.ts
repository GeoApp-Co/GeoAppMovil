import { isAxiosError } from "axios"
import api from "../lib/axios"
import { manifestSchema, paginationManifestSchema } from "../schema/manifestSchema"
import { NewManifestFormType } from "../types/manifestType"


type ManifestType = {
    page: number
    limit: number
    clientId?: string
    manifestTemplate?: string,
    estado?: string
    fecha?: string
    code: string
    manifestId: string
    formData: NewManifestFormType
} 

export async function createManifest( { formData } : Pick<ManifestType, 'formData' >) {
    try {
        const url = '/manifests'
        
        // console.log('createManifest - plateId:', formData.plateId, 'tipo:', typeof formData.plateId);
        
        const { data } = await api.post<number>(url, formData)
        // console.log('Data-----', data);
        

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            
            console.log('Error de respuesta:', error.response.data);
            throw new Error(error.response.data.error);
        }
    }
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

export async function getManifestById({ manifestId } : Pick<ManifestType, 'manifestId'>  ) {
    try {
        const url = `/manifests/${manifestId}`
        // console.log('Fetching manifest with ID:', manifestId);

        const {data} = await api.get(url)
        // console.log('Raw API response:', data);

        const response = manifestSchema.safeParse(data)
        
        if (response.success) {
            // console.log('Manifest parsed successfully:', response.data);
            return response.data
        } 

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}