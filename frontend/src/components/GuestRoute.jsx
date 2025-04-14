import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../lib/axios'

export default function GuestRoute({ children }) {
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

  if (loading) return <p className="p-6">Comprobando sesión...</p>

  return isAuth ? <Navigate to="/" /> : children
}
