import axios from "axios";
import { getItem } from "../utils/storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: `${apiUrl}/api`
})

api.interceptors.request.use(
    async config => {
        const token = await getItem('AUTH_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;