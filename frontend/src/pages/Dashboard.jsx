import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <p className="p-6">Cargando usuario o no autenticado</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hola, {user.name} ({user.role})</h1>

      <Link to="/mascotas" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Gestionar mascotas
      </Link>

      <Link to="/cuidadores" className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Ver Cuidadores
      </Link>

      <Link to="/empresas" className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Ver Empresas
      </Link>

      <Link to="/mis-reservas" className="block bg-indigo-600 text-white px-4 py-2 rounded mt-4">
        Ver mis reservas
      </Link>

      <button
        onClick={() => {
          logout()
          navigate('/')
        }}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
