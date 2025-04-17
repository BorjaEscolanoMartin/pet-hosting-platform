import { useState, useEffect } from 'react'
import api from '../lib/axios'

export default function Hosts() {
  const [hosts, setHosts] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'particular',
    location: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const fetchHosts = async () => {
    try {
      const res = await api.get('/hosts')
      setHosts(res.data)
    } catch {
      setError('Error al cargar los cuidadores')
    }
  }

  useEffect(() => {
    fetchHosts()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    try {
      if (editingId) {
        await api.put(`/hosts/${editingId}`, form)
      } else {
        await api.post('/hosts', form)
      }

      await fetchHosts()
      setForm({ name: '', description: '', type: 'particular', location: '' })
      setEditingId(null)
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('Error al guardar el cuidador')
    }
  }

  const handleEdit = (host) => {
    setForm({
      name: host.name,
      description: host.description || '',
      type: host.type,
      location: host.location || '',
    })
    setEditingId(host.id)
    setSuccess(false)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/hosts/${id}`)
      await fetchHosts()
    } catch (err) {
      console.error(err)
      setError('Error al eliminar cuidador')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mis Cuidadores</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md max-w-md">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <select name="type" value={form.type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="particular">Particular</option>
          <option value="empresa">Empresa</option>
        </select>
        <input name="location" placeholder="Ubicación" value={form.location} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Cuidador {editingId ? 'actualizado' : 'creado'} correctamente</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
          {editingId ? 'Actualizar' : 'Guardar'}
        </button>
      </form>

      <ul className="space-y-2">
        {hosts.map((host) => (
          <li key={host.id} className="bg-gray-100 p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <strong>{host.name}</strong> – {host.type} – {host.location || 'Ubicación no especificada'}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(host)} className="text-blue-600 hover:underline">Editar</button>
              <button onClick={() => handleDelete(host.id)} className="text-red-600 hover:underline">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
