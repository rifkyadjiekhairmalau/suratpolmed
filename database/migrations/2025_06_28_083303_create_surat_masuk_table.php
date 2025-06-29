<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_agenda')->unique();
            $table->foreignId('jenis_surat_id')->constrained('jenis_surat')->onDelete('restrict');
            $table->foreignId('urgensi_surat_id')->constrained('urgensi_surat')->onDelete('restrict');
            $table->foreignId('pengaju_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tujuan_user_id')->constrained('users')->onDelete('restrict');
            $table->date('tanggal_pengajuan');
            $table->string('keterangan')->nullable();
            $table->string('nomor_surat')->nullable();
            $table->string('perihal');
            $table->string('file_path')->nullable();
            $table->string('jenis_surat_manual')->nullable(); // jika user pilih "lainnya"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_masuk');
    }
};