<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pegawai extends Model
{
    protected $table = 'pegawai';

    protected $fillable = [
        'nip',
        'gelar_depan',
        'nama',
        'gelar_belakang',
        'tempat_lahir',
        'email',
        'jabatan_id',
        'jabatan_struktural_id',
        'jenis_pegawai_id',
    ];

    /**
     * Relasi ke jabatan fungsional.
     */
    public function jabatan(): BelongsTo
    {
        return $this->belongsTo(Jabatan::class);
    }

    /**
     * Relasi ke jabatan struktural.
     */
    public function jabatanStruktural(): BelongsTo
    {
        return $this->belongsTo(JabatanStruktural::class);
    }

    /**
     * Relasi ke jenis pegawai.
     */
    public function jenisPegawai(): BelongsTo
    {
        return $this->belongsTo(JenisPegawai::class);
    }

    /**
     * Relasi ke user (jika satu pegawai memiliki akun user).
     */
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'pegawai_id');
    }
}