<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    use HasFactory;

    protected $table = 'surat_keluar';

    protected $fillable = [
        'nomor_agenda', // Baru
        'nomor_surat',  // Baru
        'tanggal_keluar',
        'perihal_surat', // Baru
        'tujuan',
        'keterangan_tambahan', // Baru
        'file_surat', // Baru
        'pengirim_user_id',
    ];

    /**
     * Relasi ke user yang mengirim surat keluar ini.
     */
    public function pengirim()
    {
        return $this->belongsTo(User::class, 'pengirim_user_id');
    }
}