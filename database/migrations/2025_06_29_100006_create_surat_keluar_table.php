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
        Schema::create('surat_keluar', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_agenda')->unique(); // Nomor Agenda (Otomatis, Unique)
            $table->string('nomor_surat')->nullable(); // Nomor Surat (Bisa diisi manual atau nanti)
            $table->date('tanggal_keluar');
            $table->string('perihal_surat'); // Perihal Surat
            $table->string('tujuan');
            $table->text('keterangan_tambahan')->nullable(); // Keterangan Tambahan
            $table->string('file_surat')->nullable(); // Path file surat (sebelumnya file_path)
            $table->foreignId('pengirim_user_id')->constrained('users')->onDelete('cascade'); // User yang membuat/mengirim surat
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_keluar');
    }
};