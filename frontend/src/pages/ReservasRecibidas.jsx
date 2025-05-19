import { useEffect, useState } from 'react'
import api from '../lib/axios'

export default function ReservasRecibidas() {
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReservas()
  }, [])

  const fetchReservas = () => {
    api.get('/reservations/host')
      .then(res => setReservas(res.data))
      .catch(() => setError('Error al cargar las reservas'))
  }

  const actualizarEstado = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status })
      fetchReservas()
    } catch {
      alert('Error al actualizar el estado')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Reservas Recibidas</h1>

      {error && <p className="text-red-600">{error}</p>}

      {reservas.length === 0 && !error && (
        <p className="text-gray-500">Aún no tienes reservas asignadas.</p>
      )}

      <ul className="space-y-4">
        {reservas.map(res => (
          <li key={res.id} className="border rounded p-4 shadow bg-white">
            <p><strong>Cliente:</strong> {res.user?.name || 'Desconocido'}</p>
            <p><strong>Mascota:</strong> {res.pet?.name || 'Desconocida'}</p>
            <p><strong>Servicio:</strong> {res.service_type}</p>
            <p><strong>Fechas:</strong> {res.start_date} → {res.end_date}</p>
            <p><strong>Dirección:</strong> {res.address || '-'}</p>
            <p><strong>Estado:</strong> <span className="capitalize">{res.status}</span></p>

            {res.status === 'pendiente' && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => actualizarEstado(res.id, 'aceptada')}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => actualizarEstado(res.id, 'rechazada')}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Rechazar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
