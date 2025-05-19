import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function FormularioBusqueda() {
  const [especie, setEspecie] = useState('perro')
  const [servicio, setServicio] = useState('alojamiento')
  const [direccion, setDireccion] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tamaño, setTamaño] = useState('')

  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (especie) params.append('especie', especie)
    if (servicio) params.append('servicio', servicio)
    if (direccion) params.append('direccion', direccion)
    if (startDate) params.append('start', startDate)
    if (endDate) params.append('end', endDate)
    if (tamaño) params.append('tamano', tamaño)

    const ruta = `/cuidadores?${params.toString()}`

    if (!user) {
      localStorage.setItem('redirectAfterLogin', ruta)
    }

    navigate(ruta)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Estoy buscando un servicio para mi:</h2>

      {/* Especie */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="especie" value="perro" checked={especie === 'perro'} onChange={() => setEspecie('perro')} />
          Perro
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="especie" value="gato" checked={especie === 'gato'} onChange={() => setEspecie('gato')} />
          Gato
        </label>
      </div>

      {/* Servicio */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { value: 'alojamiento', label: 'Alojamiento de mascotas' },
          { value: 'domicilio', label: 'Cuidado a domicilio' },
          { value: 'visitas', label: 'Visitas a domicilio' },
          { value: 'guarderia', label: 'Guardería de día' },
          { value: 'paseo', label: 'Paseo de perros' },
        ].map(op => (
          <button
            key={op.value}
            type="button"
            onClick={() => setServicio(op.value)}
            className={`border px-4 py-2 rounded text-sm text-center ${
              servicio === op.value ? 'border-blue-600 font-semibold' : 'border-gray-300'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Dirección y fechas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Código postal o dirección"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          placeholder="Entrada"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          placeholder="Salida"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Tamaño */}
      <h3 className="text-sm font-semibold mb-2">Mi perro es</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { value: 'pequeño', label: 'Pequeño\n0 – 7 kg' },
          { value: 'mediano', label: 'Mediano\n7 – 18 kg' },
          { value: 'grande', label: 'Grande\n18 – 45 kg' },
          { value: 'gigante', label: 'Gigante\n45+ kg' },
        ].map(size => (
          <button
            key={size.value}
            type="button"
            onClick={() => setTamaño(size.value)}
            className={`border px-4 py-2 rounded text-sm whitespace-pre ${
              tamaño === size.value ? 'border-blue-600 font-semibold' : 'border-gray-300'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Buscar
      </button>
    </form>
  )
}
