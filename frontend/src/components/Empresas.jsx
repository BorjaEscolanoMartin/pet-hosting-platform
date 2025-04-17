import { useEffect, useState } from 'react'
import api from '../lib/axios'
import { Link } from 'react-router-dom'

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await api.get('/empresas')
        setEmpresas(res.data)
      } catch (err) {
        console.error('Error al cargar empresas', err)
      }
    }

    fetchEmpresas()
  }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Empresas registradas</h1>
      <ul className="space-y-2">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="bg-gray-100 p-3 rounded shadow-sm">
            <p><strong>Nombre:</strong> {empresa.name}</p>
            <p><strong>Email:</strong> {empresa.email}</p>
          </li>
        ))}
      </ul>

      <Link
        to="/"
        className="inline-block mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}
