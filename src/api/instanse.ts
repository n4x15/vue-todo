import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL as string

const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

export default apiClient
