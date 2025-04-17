import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/axios'
import { Link } from 'react-router-dom'

export default function PetDetail() {
  const { id } = useParams()
  const [pet, setPet] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`)
        console.log('Pet recibida:', res.data)
        setPet(res.data)
      } catch (err) {
        setError('No se pudo cargar la mascota')
        console.error(err)
      }
    }

    fetchPet()
  }, [id])

  if (error) return <p className="text-red-600">{error}</p>
  if (!pet) return <p>Cargando mascota...</p>

  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">{pet.name}</h1>
        {pet.photo_url && (
          <img
            src={`http://localhost:8000${pet.photo_url}`}
            alt={`Foto de ${pet.name}`}
            className="w-64 h-64 object-cover rounded shadow-md"
          />
        )}
        <p><strong>Especie:</strong> {pet.species}</p>
        <p><strong>Raza:</strong> {pet.breed || 'N/A'}</p>
        <p><strong>Edad:</strong> {pet.age} años</p>
        <p><strong>Tamaño:</strong> {pet.size}</p>
        <p><strong>Descripción:</strong> {pet.description}</p>
      </div>
  
      <Link
        to="/mascotas"
        className="mt-6 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        Volver a mis mascotas
      </Link>
    </>
  )
}