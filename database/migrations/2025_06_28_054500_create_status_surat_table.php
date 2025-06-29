<?php

// database/migrations/xxxx_xx_xx_create_status_surat_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('status_surat', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique(); // kode logika: diajukan, verifikasi, dll
            $table->string('nama_status');    // teks default yang tampil
            $table->integer('urutan')->default(0); // urutan dalam alur surat
            $table->boolean('final')->default(false); // status akhir?
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('status_surat');
    }
};