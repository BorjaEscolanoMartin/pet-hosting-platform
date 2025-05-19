import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/axios'

export default function ReservaForm() {
  const { id: hostId } = useParams() // cuidador/host
  const [form, setForm] = useState({
    pet_id: '',
    service_type: 'alojamiento',
    frequency: 'una_vez',
    address: '',
    start_date: '',
    end_date: '',
    size: '',
  })
  const [mascotas, setMascotas] = useState([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/pets')
      .then(res => setMascotas(res.data))
      .catch(() => setError('Error cargando tus mascotas'))
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSuccess(false)
    setError(null)

    try {
      await api.post('/reservations', {
        ...form,
        host_id: hostId,
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('No se pudo crear la reserva.')
    }
  }

  return (
    <div className="mt-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Solicitar reserva</h2>

      {success && <p className="text-green-600 mb-4">Reserva enviada correctamente ✅</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="pet_id" value={form.pet_id} onChange={handleChange} className="w-full border rounded p-2" required>
          <option value="">Selecciona tu mascota</option>
          {mascotas.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select name="service_type" value={form.service_type} onChange={handleChange} className="w-full border rounded p-2">
          <option value="alojamiento">Alojamiento</option>
          <option value="domicilio">Cuidados en domicilio</option>
          <option value="visitas">Visitas a domicilio</option>
          <option value="guarderia">Guardería de día</option>
          <option value="paseo">Paseo</option>
        </select>

        <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full border rounded p-2">
          <option value="una_vez">Una vez</option>
          <option value="semanal">Recurrente (semanal)</option>
        </select>

        <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} className="w-full border rounded p-2" />

        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full border rounded p-2" required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="w-full border rounded p-2" required />

        <select name="size" value={form.size} onChange={handleChange} className="w-full border rounded p-2">
          <option value="">Tamaño</option>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
          <option value="gigante">Gigante</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enviar solicitud</button>
      </form>
    </div>
  )
}
