import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { isServer } from '../utils';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export function handleResponseError(error: AxiosError) {
    if (error.response && 401 === error.response.status) {
        if (!isServer() && window.location.href.split('/').pop() !== 'login') {
            toast.error('Sessão expirada. Retornando para login.');
            window.location.href = '/login';
        }
    }

    return Promise.reject(error);
}

api.interceptors.response.use(response => response, handleResponseError)

export default api