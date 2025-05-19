<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Cliente
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');
            $table->foreignId('host_id')->constrained()->onDelete('cascade'); // Cuidador/empresa

            $table->enum('service_type', ['alojamiento', 'domicilio', 'visitas', 'guarderia', 'paseo']);
            $table->enum('frequency', ['una_vez', 'semanal']);
            $table->string('address')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('size', ['pequeño', 'mediano', 'grande', 'gigante'])->nullable();
            $table->enum('status', ['pendiente', 'aceptada', 'rechazada', 'cancelada'])->default('pendiente');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
