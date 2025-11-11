import { createAxiosInstance } from './axios'

const baseURL = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_BASE_URL_DEV_CLIENT 
  : import.meta.env.VITE_BASE_URL_PRO_CLIENT

export default createAxiosInstance(baseURL)