import { isAxiosError } from "axios"
import api from "../lib/axios"
import { TemplatesSchema } from "../schema/templateSchema"

// type TemplateType = {
//     search?: string,
// }

export async function getTemplates() {
    try {
        const url = '/templates'
        const {data} = await api.get(url, {})

        const response = TemplatesSchema.safeParse(data)
        console.log('geTemplates', response.error);
        

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