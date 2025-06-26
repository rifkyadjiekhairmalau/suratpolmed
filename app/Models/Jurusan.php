<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jurusan extends Model
{
    protected $table = 'jurusan'; // nama tabel

    protected $fillable = [
        'nama_jurusan',
    ];

    // Relasi ke program studi (Prodi) — satu jurusan bisa punya banyak prodi
    public function prodis()
    {
        return $this->hasMany(Prodi::class, 'jurusan_id');
    }

    // Relasi ke mahasiswa — satu jurusan bisa punya banyak mahasiswa
    public function mahasiswas()
    {
        return $this->hasMany(Mahasiswa::class, 'jurusan_id');
    }
}