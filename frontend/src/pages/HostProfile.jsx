// src/pages/HostProfile.jsx
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HostProfile() {
  const [form, setForm] = useState({
    name: '',
    type: 'particular',
    location: '',
    description: '',
  });

  const [hostId, setHostId] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener host actual del usuario
    api.get('/hosts')
      .then(res => {
        if (res.data.length > 0) {
          const host = res.data[0]; // asumimos solo uno
          setForm({
            name: host.name,
            type: host.type,
            location: host.location,
            description: host.description,
          });
          setHostId(host.id);
        }
      })
      .catch(err => {
        console.error('Error cargando host:', err);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(false);
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })
      if (hostId) {
        await api.put(`/hosts/${hostId}`, form);
      } else {
        const res = await api.post('/hosts', form);
        setHostId(res.data.id);
      }
      setSuccess(true);
    } catch (err) {
      console.error('Error guardando perfil:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Perfil de Cuidador</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del servicio"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="particular">Particular</option>
          <option value="empresa">Empresa</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Ubicación"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {hostId ? 'Actualizar perfil' : 'Crear perfil'}
        </button>

        {success && <p className="text-green-600">Perfil guardado correctamente ✅</p>}
      </form>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 underline text-sm text-gray-600"
      >
        ← Volver al panel
      </button>
    </div>
  );
}
