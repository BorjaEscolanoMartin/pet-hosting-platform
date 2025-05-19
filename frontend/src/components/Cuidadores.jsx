import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'

export default function Cuidadores() {
  const [searchParams] = useSearchParams()
  const [cuidadores, setCuidadores] = useState([])
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const servicio = searchParams.get('servicio')
  const especie = searchParams.get('especie')
  const direccion = searchParams.get('direccion')
  const tamaño = searchParams.get('tamano')

  useEffect(() => {
    const fetchCuidadores = async () => {
      try {
        const res = await api.get('/cuidadores')
        let filtrados = res.data

        if (servicio) {
          filtrados = filtrados.filter(c => c.hosts?.some(h => h.type === servicio))
        }

        if (especie) {
          filtrados = filtrados.filter(c => c.especie_preferida?.includes(especie))
        }

        if (tamaño) {
          filtrados = filtrados.filter(c => c.tamanos_aceptados?.includes(tamaño))
        }

        setCuidadores(filtrados)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los cuidadores.')
      }
    }

    fetchCuidadores()
  }, [servicio, especie, direccion, tamaño])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cuidadores disponibles</h1>

      {(servicio || especie || direccion || tamaño) && (
        <div className="text-sm text-gray-500 mb-4">
          <p><strong>Filtros:</strong></p>
          {servicio && <p>- Servicio: {servicio}</p>}
          {especie && <p>- Especie: {especie}</p>}
          {direccion && <p>- Dirección: {direccion}</p>}
          {tamaño && <p>- Tamaño: {tamaño}</p>}
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {cuidadores.length === 0 && !error && (
          <p className="text-gray-600">No se encontraron cuidadores con esos filtros.</p>
        )}

        {cuidadores.map(cuidador => (
          <li key={cuidador.id} className="bg-white p-4 rounded shadow">
            <p className="text-lg font-semibold text-gray-800">{cuidador.name}</p>
            <p className="text-sm text-gray-600 mb-2">{cuidador.email}</p>

            <div className="flex flex-wrap gap-2 mb-2">
              {cuidador.especie_preferida?.map((tipo, idx) => (
                <span
                  key={`esp-${cuidador.id}-${idx}`}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
              ))}

              {cuidador.tamanos_aceptados?.map((t, idx) => (
                <span
                  key={`tam-${cuidador.id}-${idx}`}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              ))}

              {cuidador.hosts?.map((host, idx) => (
                <span
                  key={`host-${cuidador.id}-${idx}`}
                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >
                  {host.type.charAt(0).toUpperCase() + host.type.slice(1)}
                </span>
              ))}
            </div>

            <div className="mt-2">
              <button
                onClick={() => {
                  const ruta = `/cuidadores/${cuidador.id}`
                  if (!user) {
                    localStorage.setItem('redirectAfterLogin', ruta)
                  }
                  navigate(ruta)
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Ver perfil →
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
