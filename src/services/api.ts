import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { isServer } from '../utils';

const api = axios.create({
    // `/backend` (relativo, same-origin) em vez de `NEXT_PUBLIC_API_URL` direto — passa pelo
    // proxy reverso do `next.config.js` (review-human.md #2) em vez de bater cross-origin no
    // Render. Precisa subir junto da troca do callback OAuth no GitHub (painel, manual): até lá,
    // o cookie de sessão continua nascendo em `onrender.com`, e chamada aqui pra `/backend/*`
    // (que o browser vê como `vercel.app`) não teria esse cookie pra enviar — ver sequência de
    // deploy em review-human.md #2.
    baseURL: '/backend',
    // sessão vive num cookie httpOnly no backend — same-origin já manda cookie sozinho, mas
    // manter não atrapalha (só importa de verdade em request cross-origin).
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