import { useState } from 'react'
import axios from 'axios'
import api from '../lib/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

      const xsrf = decodeURIComponent(
        document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1]
      )

      await api.post('/login', { email, password }, {
        headers: {
          'X-XSRF-TOKEN': xsrf,
        },
      })

      const res = await api.get('/user')
      setUser(res.data)

      const redirectTo = localStorage.getItem('redirectAfterLogin')

      localStorage.removeItem('redirectAfterLogin')

      if (redirectTo) {
        navigate(redirectTo)
      } else {
        // redirigir según rol
        if (res.data.role === 'cliente') {
          navigate('/')
        } else if (res.data.role === 'cuidador') {
          navigate('/')
        } else if (res.data.role === 'empresa') {
          navigate('/')
        } else {
          navigate('/') // fallback
        }
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
