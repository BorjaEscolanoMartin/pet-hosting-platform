import { useEffect, useState } from 'react'
import api from '../lib/axios'
import axios from 'axios' // <- necesario para csrf-cookie
import { Link } from 'react-router-dom';

// ...
export default function Pets() {
  const [pets, setPets] = useState([])
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    size: '',
    description: '',
    photo: null, 
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const fetchPets = async () => {
    const res = await api.get('/pets')
    setPets(res.data)
  }

  useEffect(() => {
    fetchPets()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'photo') {
      setForm({ ...form, photo: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
  
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      })
  
      const data = new FormData()
      Object.keys(form).forEach((key) => {
        if (form[key]) data.append(key, form[key])
      })
  
      if (editingId) {
        await api.post(`/pets/${editingId}?_method=PUT`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/pets', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
  
      await fetchPets()
      setForm({ name: '', species: '', breed: '', age: '', size: '', description: '', photo: null })
      setEditingId(null)
      setSuccess(true)
    } catch (err) {
      console.error(err)
  
      if (err.response?.data?.errors) {
        console.log('Errores de validación:', err.response.data.errors)
      }
  
      setError('Error al guardar la mascota')
    }
  }
  

  const handleEdit = (pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age || '',
      size: pet.size || '',
      description: pet.description || '',
      photo: null,
    })
    setEditingId(pet.id)
    setSuccess(false)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pets/${id}`)
      await fetchPets()
    } catch (err) {
      console.error(err)
      setError('Error al eliminar mascota')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mis Mascotas</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md max-w-md" encType="multipart/form-data">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="species" placeholder="Especie" value={form.species} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="breed" placeholder="Raza" value={form.breed} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="age" type="number" placeholder="Edad" value={form.age} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="size" placeholder="Tamaño" value={form.size} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Mascota {editingId ? 'actualizada' : 'creada'} correctamente</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
          {editingId ? 'Actualizar' : 'Guardar'}
        </button>
      </form>

      <ul className="space-y-2">
        {pets.map((pet) => (
          <li key={pet.id} className="bg-gray-100 p-3 rounded shadow-sm flex justify-between items-center">
            <div>
              <Link to={`/mascotas/${pet.id}`} className="text-blue-600 hover:underline font-semibold">
                {pet.name}
              </Link> – {pet.species} ({pet.breed || 'Sin raza'}) – {pet.age} años
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(pet)} className="text-blue-600 hover:underline">Editar</button>
              <button onClick={() => handleDelete(pet.id)} className="text-red-600 hover:underline">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/"
        className="mt-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}
