import { isAxiosError } from 'axios';
import api from '../lib/axios';
import { LoginFormType } from '../types/userType';
import { saveItem } from '../utils/storage';
import { userSchema,} from '../schema/userSchema';


type LoginType = {
    loginForm: LoginFormType
}

export async function login({ loginForm }: Pick<LoginType, 'loginForm'>) {
    try {
        const { data } = await api.post<string>(`/auth/login`, loginForm);
        saveItem('AUTH_TOKEN', data);

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log('Login error:', error);
            throw new Error(error.response.data.error);
        }
    }
}

export async function getUser() {
    try {
        const { data } = await api.get('/users');
        const response = userSchema.safeParse(data)
        if (response.success) {
            // Guardar el usuario en la clave USER, no en AUTH_TOKEN
            saveItem('USER', JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error al obtener el usuario.");
        }
    }
}

export async function logout() {
  // Si tu API requiere endpoint de logout, implementa aquí
}
