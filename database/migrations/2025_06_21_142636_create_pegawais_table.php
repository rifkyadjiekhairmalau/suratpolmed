<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pegawai', function (Blueprint $table) {
            $table->id();
            $table->string('nip', 30);
            $table->string('gelar_depan', 50)->nullable();
            $table->string('nama', 100);
            $table->string('gelar_belakang', 50)->nullable();
            $table->string('tempat_lahir', 100);
            $table->string('email', 100);
            $table->foreignId('jabatan_id')->constrained('jabatan');
            $table->foreignId('jabatan_struktural_id')->constrained('jabatan_struktural');
            $table->foreignId('jenis_pegawai_id')->constrained('jenis_pegawai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawai');
    }
};