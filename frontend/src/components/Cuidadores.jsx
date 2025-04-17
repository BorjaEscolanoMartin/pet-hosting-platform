import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { Link } from 'react-router-dom'

export default function Cuidadores() {
  const [cuidadores, setCuidadores] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCuidadores = async () => {
      try {
        const res = await api.get('/cuidadores')
        setCuidadores(res.data)
      } catch (err) {
        console.error(err)
        setError('Error al cargar los cuidadores')
      }
    }

    fetchCuidadores()
  }, [])

  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cuidadores Disponibles</h1>
      <ul className="space-y-3">
        {cuidadores.map((cuidador) => (
          <li key={cuidador.id} className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Nombre:</strong> {cuidador.name}</p>
            <p><strong>Email:</strong> {cuidador.email}</p>
          </li>
        ))}
      </ul>
      <Link
        to="/"
        className="inline-block mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}
