<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'username',
        'name',
        'password',
        'level_user_id',
        'mahasiswa_id',
        'pegawai_id',
        'jabatan_struktural_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Casting tipe data
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relasi ke LevelUser
    public function levelUser()
    {
        return $this->belongsTo(LevelUser::class);
    }

    // Relasi ke Mahasiswa (nullable)
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    // Relasi ke Pegawai (nullable)
    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class);
    }

    // Relasi ke JabatanStruktural (nullable)
    public function jabatanStruktural()
    {
        return $this->belongsTo(JabatanStruktural::class);
    }

    // Mutator untuk password agar otomatis di-hash
    public function setPasswordAttribute($password)
    {
        // Hanya hash jika password belum hashed
        if (\Illuminate\Support\Facades\Hash::needsRehash($password)) {
            $this->attributes['password'] = bcrypt($password);
        } else {
            $this->attributes['password'] = $password;
        }
    }

    // Contoh scope untuk user aktif
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}