<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    protected $table = 'program_studi'; // sesuaikan dengan nama tabel di migrasi

    protected $fillable = [
        'nama_prodi',
        'jurusan_id',
    ];

    // Relasi ke Jurusan
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class);
    }

    public function mahasiswas()
{
    return $this->hasMany(Mahasiswa::class, 'prodi_id');
}
}