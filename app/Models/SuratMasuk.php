<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SuratMasuk extends Model
{
    use HasFactory;

    protected $table = 'surat_masuk';

    protected $fillable = [
        'nomor_agenda',
        'jenis_surat_id',
        'urgensi_surat_id',
        'pengaju_user_id',
        'tujuan_user_id',
        'tanggal_pengajuan',
        'keterangan',
        'nomor_surat',
        'perihal',
        'file_path',
        'jenis_surat_manual',
    ];

    // Relasi
    public function jenisSurat()
    {
        return $this->belongsTo(JenisSurat::class);
    }

    public function urgensi()
    {
        return $this->belongsTo(UrgensiSurat::class, 'urgensi_surat_id');
    }

    public function pengaju()
    {
        return $this->belongsTo(User::class, 'pengaju_user_id');
    }

    public function tujuan()
    {
        return $this->belongsTo(User::class, 'tujuan_user_id');
    }

    public function tracking()
    {
        // Ubah ini menjadi latest() atau orderByDesc('created_at')
        return $this->hasMany(TrackingSurat::class)->latest(); // ATAU ->orderByDesc('created_at');
    }
}