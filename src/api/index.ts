import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const ROOT_PATH = process.env.REACT_APP_ROOT_PATH || '';
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error: any) => Promise.reject(error));

api.interceptors.response.use((response: AxiosResponse) => {
    return response;
}, (error: AxiosError) => {
    if (error.response?.status === 401) {
        if (['/login', '/erp/login'].includes(window.location.pathname)) {
            return Promise.reject(error);
        }

        localStorage.removeItem("access_token");
        window.location.href = `${ROOT_PATH}/login`;
    } else {
        return Promise.reject(error);
    }
})

export default api;
