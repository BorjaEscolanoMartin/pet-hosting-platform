import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Comprobar token al iniciar la app
  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        // Configurar header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        const res = await api.get('/user')
        setUser(res.data)
      } catch {
        console.warn('Token inválido o expirado')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verificarToken()
  }, [])

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (token) {
        await api.post('/logout')
      }
    } catch (err) {
      console.error('Error al cerrar sesión', err)
    } finally {
      // Limpiar siempre, incluso si falla la petición
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

