import axios from 'axios'
import { toast } from 'react-toastify'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (401 === error.response.status) {
        if (window.location.href.split('/').pop() !== 'login') {
            toast.error('Sessão expirada. Retornando para login.');
            //window.location.href = '/login';
        }
    } else {
        return Promise.reject(error);
    }
});

export default api