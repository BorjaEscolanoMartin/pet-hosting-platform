import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../lib/axios'

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    api.get('/user')
      .then(() => {
        setIsAuth(true)
        setLoading(false)
      })
      .catch(() => {
        setIsAuth(false)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-6">Cargando autenticación...</p>

  return isAuth ? children : <Navigate to="/login" />
}
