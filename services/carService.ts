import { isAxiosError } from "axios";
import api from "../lib/axios";
import { responseCarsSchema } from "../schema/carSchema";



export async function getCars() {
    try {
        const url = '/cars'
        const { data } = await api.get(url)
        
        const response = responseCarsSchema.safeParse(data)
        
        if (response.success) {
            return response.data
        } else {
            return {
                cars: []
            }
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            // console.log(error);
            throw new Error(error.response.data.error);
        }
    }
}