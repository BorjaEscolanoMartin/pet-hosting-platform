// src/pages/PerfilCuidador.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/axios'
import ReservaForm from '../components/ReservaForm'

export default function PerfilCuidador() {
  const { id } = useParams()
  const [host, setHost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/hosts/${id}`)
      .then(res => setHost(res.data))
      .catch(err => console.error('Error cargando cuidador:', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-center mt-10">Cargando cuidador...</p>

  if (!host) return <p className="text-center mt-10 text-red-600">Cuidador no encontrado</p>

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{host.name}</h1>
      <p className="text-sm mb-2 text-gray-600">Tipo: {host.type}</p>
      <p className="text-sm mb-2 text-gray-600">Ubicación: {host.location}</p>
      <p className="mb-4 whitespace-pre-wrap">{host.description || 'Sin descripción.'}</p>

      <Link
        to="/cuidadores"
        className="text-blue-600 underline"
      >
        ← Volver a lista de cuidadores
      </Link>

      <ReservaForm />
    </div>
  )
}
