import { createAxiosInstance } from './axios'

const baseURL = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_BASE_URL_DEV_SYSTEM 
  : import.meta.env.VITE_BASE_URL_PRO_SYSTEM

export default createAxiosInstance(baseURL)