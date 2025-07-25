import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import { useChat } from '../context/useChat'
import { useToast } from '../context/ToastContext'
import ChatModal from '../components/chat/ChatModal'

export default function ReservasRecibidas() {
  const [reservas, setReservas] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const { createPrivateChat, setActiveChat } = useChat()
  const { error: showError } = useToast()
  useEffect(() => {
    fetchReservas()
  }, [])

  const fetchReservas = () => {
    setLoading(true)
    api.get('/reservations/host')
      .then(res => {
        // Ordenar reservas de la más reciente a la más antigua (basado en created_at o id)
        const reservasOrdenadas = res.data.sort((a, b) => {
          // Intentar ordenar por created_at si está disponible, sino por id (descendente)
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at)
          }
          return b.id - a.id
        })
        setReservas(reservasOrdenadas)
        setLoading(false)
      })      .catch(() => {
        setError('Error al cargar las reservas')
        setLoading(false)
      })
  }
  
  const actualizarEstado = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status })
      fetchReservas()
    } catch {
      showError('Error al actualizar el estado')
    }
  }
  const handleContactarCliente = async (clienteUserId) => {
    try {
      // Crear o obtener el chat privado con el cliente
      const chat = await createPrivateChat(clienteUserId)
      
      // Establecer como chat activo
      setActiveChat(chat)
      
      // Esperar un momento para que se establezca el estado
      setTimeout(() => {
        // Abrir el modal de chat
        setIsChatModalOpen(true)
      }, 100)    } catch (error) {
      showError(`Error al abrir chat: ${error.message}`)
    }
  }
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada'
    const date = new Date(dateString)
    // Formatear como día/mes/año
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-blue-100">
          {/* Animated loading icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cargando reservas</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Obteniendo las solicitudes recibidas...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Reservas Recibidas
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Gestiona las solicitudes de reserva de tus clientes
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Estado vacío */}
        {reservas.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No tienes reservas pendientes</h3>
            <p className="text-gray-600">Las nuevas solicitudes aparecerán aquí cuando los clientes hagan reservas.</p>
          </div>
        )}

        {/* Lista de reservas */}
        <div className="space-y-6">
          {reservas.map(res => (
            <div key={res.id} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300">
              {/* Header de la reserva */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🐾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Reserva #{res.id}</h3>
                    <p className="text-gray-600 font-medium">{res.service_type}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  res.status === 'pendiente' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                    : res.status === 'aceptada'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {res.status === 'pendiente' ? '⏳ Pendiente' : 
                   res.status === 'aceptada' ? '✅ Aceptada' : '❌ Rechazada'}
                </div>
              </div>

              {/* Información de la reserva */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Cliente</p>
                      <p className="font-bold text-gray-800">{res.user?.name || 'Desconocido'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600">🐕</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Mascota</p>
                      <p className="font-bold text-gray-800">{res.pet?.name || 'Desconocida'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">📅</span>
                    </div>                    <div>
                      <p className="text-sm font-semibold text-gray-500">Fechas</p>
                      <p className="font-bold text-gray-800">{formatDate(res.start_date)} → {formatDate(res.end_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600">📍</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Dirección</p>
                      <p className="font-bold text-gray-800">{res.address || 'No especificada'}</p>
                    </div>
                  </div>
                </div>
              </div>              {/* Botones de acción */}
              {res.status === 'pendiente' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => actualizarEstado(res.id, 'aceptada')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">✅</span>
                    Aceptar Reserva
                  </button>
                  <button
                    onClick={() => actualizarEstado(res.id, 'rechazada')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">❌</span>
                    Rechazar Reserva
                  </button>
                </div>
              )}              {/* Botón de contacto para reservas aceptadas */}
              {res.status === 'aceptada' && res.user && (
                <div className="flex justify-center pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => handleContactarCliente(res.user?.id)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-3 px-6 rounded-xl transition-all duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="text-lg">📞</span>
                    Contactar Cliente
                  </button>
                </div>
              )}
            </div>
          ))}        </div>        {/* Botón Volver al Inicio */}
        <div className="text-center pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-lg">🏠</span>
            Volver al Inicio
          </Link>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}
