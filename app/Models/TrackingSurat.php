<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Pastikan ini diimport

class TrackingSurat extends Model
{
    use HasFactory; // Pastikan ini digunakan

    protected $table = 'tracking_surat'; // Nama tabel di database

    protected $fillable = [
        'surat_masuk_id',
        'status_surat_id',
        'dari_user_id',
        'ke_user_id',
        'user_id', // <<< PASTIKAN INI ADA DI FILLABLE KARENA SEKARANG ADA DI MIGRASI
        'catatan',
        // 'tanggal', // Jika Anda tidak jadi menambahkan kolom 'tanggal' di migrasi, jangan sertakan di fillable
    ];

    /**
     * Relasi ke model SuratMasuk.
     */
    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class, 'surat_masuk_id');
    }

    /**
     * Relasi ke model StatusSurat.
     */
    public function status()
    {
        return $this->belongsTo(StatusSurat::class, 'status_surat_id');
    }

    /**
     * Relasi ke model User yang melakukan aksi tracking ini.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke model User yang menjadi 'pengirim' disposisi/penerusan.
     */
    public function dariUser()
    {
        return $this->belongsTo(User::class, 'dari_user_id');
    }

    /**
     * Relasi ke model User yang menjadi 'penerima' disposisi/penerusan.
     */
    public function keUser()
    {
        return $this->belongsTo(User::class, 'ke_user_id');
    }
}