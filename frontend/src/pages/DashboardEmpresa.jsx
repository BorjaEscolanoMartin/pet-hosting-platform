import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { useNavigate } from 'react-router-dom'

export default function DashboardEmpresa() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/user')
      .then((res) => setUser(res.data))
      .catch(() => navigate('/login'))
  }, [navigate])

  const handleLogout = async () => {
    try {
      const xsrf = decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
      )

      await api.post('/logout', {}, {
        headers: {
          'X-XSRF-TOKEN': xsrf,
        },
      })

      setUser(null)
      navigate('/login')
    } catch (err) {
      console.error('Error al cerrar sesión', err)
    }
  }

  return (
    <div className="p-6">
      {user ? (
        <>
          <h1 className="text-xl font-bold mb-4">
            Bienvenida empresa, {user.name} ({user.role})
          </h1>

          <p className="mb-4 text-gray-700">
            Desde este panel podrás gestionar los servicios que tu empresa ofrece a los clientes.
          </p>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <p>Cargando usuario o no autenticado</p>
      )}
    </div>
  )
}
