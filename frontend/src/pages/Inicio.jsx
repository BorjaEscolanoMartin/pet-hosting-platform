import FormularioBusqueda from '../components/FormularioBusqueda'

export default function Inicio() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative flex flex-col justify-center items-center text-center py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-2xl">
          Cuidado de mascotas con amor en tu barrio™
        </h1>
        <p className="text-gray-600 mt-3 mb-6 text-lg max-w-xl">
          Reserva cuidadores y paseadores de perros de confianza.
        </p>
        <FormularioBusqueda />
      </div>
    </div>
  )
}
