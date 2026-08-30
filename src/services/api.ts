import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { isServer } from '../utils';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // sessão vive num cookie httpOnly no backend — precisa disso pro browser enviar o cookie
    // em requests cross-origin (frontend e backend em portas/domínios diferentes)
    withCredentials: true,
})

export function handleResponseError(error: AxiosError) {
    // GET /me é a checagem passiva de sessão feita a cada carregamento (hydrateAuth) — um 401
    // ali só significa "visitante anônimo", não "sessão expirou no meio do uso". Qualquer outro
    // endpoint autenticado que devolva 401 é, sim, sessão expirada de verdade.
    const isSessionCheck = error.config?.url === '/me';

    if (!isSessionCheck && error.response && 401 === error.response.status) {
        if (!isServer() && window.location.href.split('/').pop() !== 'login') {
            toast.error('Sessão expirada. Retornando para login.');
            window.location.href = '/login';
        }
    }

    return Promise.reject(error);
}

api.interceptors.response.use(response => response, handleResponseError)

export default api