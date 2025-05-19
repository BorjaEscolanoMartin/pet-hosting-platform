import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-600">
        🐾 Pet Hosting
      </Link>

      <nav className="flex items-center gap-6 text-sm relative">
        <Link to="/cuidadores" className="hover:underline">Buscar cuidadores</Link>

        {!user ? (
          <>
            <Link to="/register" className="hover:underline">Registrarse</Link>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
          </>
        ) : (
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="font-semibold text-gray-800 hover:underline">
              {user.name} ⌄
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow w-48 z-50">
                {user.role === 'cliente' && (
                  <>
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                    <Link to="/mascotas" className="block px-4 py-2 hover:bg-gray-100">Mis mascotas</Link>
                    <Link to="/mis-reservas" className="block px-4 py-2 hover:bg-gray-100">Mis reservas</Link>
                  </>
                )}

                {user.role === 'cuidador' && (
                  <>
                    <Link to="/mi-perfil-cuidador" className="block px-4 py-2 hover:bg-gray-100">Mi perfil</Link>
                    <Link to="/reservas-recibidas" className="block px-4 py-2 hover:bg-gray-100">Reservas recibidas</Link>
                  </>
                )}

                {user.role === 'empresa' && (
                  <>
                    <Link to="/dashboard-empresa" className="block px-4 py-2 hover:bg-gray-100">Dashboard empresa</Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
