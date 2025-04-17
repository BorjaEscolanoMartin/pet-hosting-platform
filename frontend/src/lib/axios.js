import axios from 'axios'

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // necesario para enviar cookies entre frontend y backend
})

// Interceptor para incluir automáticamente el header X-XSRF-TOKEN
api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN')
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
  }
  return config
})

// Función para leer cookies del navegador
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

export default api
