import { useState } from 'react'
import axios from 'axios'
import api from '../lib/axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      // 1. Obtener cookie CSRF
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      })

      // 2. Extraer token XSRF de cookie
      const xsrf = decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
      )

      // 3. Enviar credenciales
      await api.post('/login', { email, password }, {
        headers: {
          'X-XSRF-TOKEN': xsrf,
        },
      })

      // 4. Obtener el usuario autenticado
      const res = await api.get('/user')
      const role = res.data.role

      // 5. Redirigir según el rol
      if (role === 'cliente') {
        navigate('/dashboard')
      } else if (role === 'cuidador') {
        navigate('/dashboard-cuidador')
      } else if (role === 'empresa') {
        navigate('/dashboard-empresa')
      }

    } catch (err) {
      console.error(err)
      setError('Credenciales incorrectas o fallo en el login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Iniciar sesión</h2>

        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Entrar
        </button>
      </form>
    </div>
  )
}
