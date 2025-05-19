import { useEffect, useState } from 'react'
import api from '../lib/axios'

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/reservations')
      .then(res => setReservas(res.data))
      .catch(() => setError('Error al cargar tus reservas'))
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Reservas</h1>

      {error && <p className="text-red-600">{error}</p>}

      {reservas.length === 0 && !error && (
        <p className="text-gray-500">Aún no tienes reservas registradas.</p>
      )}

      <ul className="space-y-4">
        {reservas.map(res => (
          <li key={res.id} className="border rounded p-4 shadow">
            <p><strong>Mascota:</strong> {res.pet?.name || 'Desconocida'}</p>
            <p><strong>Cuidador:</strong> {res.host?.name || 'Desconocido'}</p>
            <p><strong>Servicio:</strong> {res.service_type}</p>
            <p><strong>Fechas:</strong> {res.start_date} → {res.end_date}</p>
            <p><strong>Estado:</strong> <span className="capitalize">{res.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  )
}
