<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    // Cliente: crear reserva
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pet_id' => 'required|exists:pets,id',
            'host_id' => 'required|exists:hosts,id',
            'service_type' => 'required|in:alojamiento,domicilio,visitas,guarderia,paseo',
            'frequency' => 'required|in:una_vez,semanal',
            'address' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'size' => 'nullable|in:pequeño,mediano,grande,gigante',
        ]);

        $reservation = $request->user()->reservations()->create($validated);

        return response()->json($reservation, 201);
    }

    // Cliente: ver sus reservas
    public function index(Request $request)
    {
        return $request->user()->reservations()->with('pet', 'host')->get();
    }

    // Cuidador: ver reservas que recibió
    public function forHost(Request $request)
    {
        return Reservation::where('host_id', $request->user()->hosts()->first()->id)
            ->with('pet', 'user')
            ->get();
    }

    // Cuidador: actualizar estado
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pendiente,aceptada,rechazada,cancelada',
        ]);

        $reservation = Reservation::findOrFail($id);

        // Solo permitir que el cuidador correspondiente actualice su reserva
        if ($reservation->host->user_id !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $reservation->update($validated);
        return response()->json($reservation);
    }
}

