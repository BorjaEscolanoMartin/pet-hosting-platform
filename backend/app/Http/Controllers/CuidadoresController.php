<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class CuidadoresController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'cuidador')->with('hosts');

        // Filtrar por tipo de servicio (ej: alojamiento, paseo, etc.)
        if ($request->filled('servicio')) {
            $query->whereHas('hosts', function ($q) use ($request) {
                $q->where('type', $request->servicio);
            });
        }

        // Filtrar por especie (si lo tienes implementado)
        if ($request->filled('especie')) {
            $query->where('especie_preferida', 'like', "%{$request->especie}%");
        }

        // Filtrar por tamaño aceptado (si aplica)
        if ($request->filled('tamaño')) {
            $query->where('tamanos_aceptados', 'like', "%{$request->tamaño}%");
        }

        return $query->get();
    }
}

