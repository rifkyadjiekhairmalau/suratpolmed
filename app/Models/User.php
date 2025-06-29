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

    // Surat yang diajukan user
    public function suratPengajuan()
    {
        return $this->hasMany(SuratMasuk::class, 'pengaju_user_id');
    }

    // Surat yang menjadi tujuan user
    public function suratTujuan()
    {
        return $this->hasMany(SuratMasuk::class, 'tujuan_user_id');
    }

    // Tracking surat dari user ini
    public function trackingDari()
    {
        return $this->hasMany(TrackingSurat::class, 'dari_user_id');
    }

    // Tracking surat ke user ini
    public function trackingKe()
    {
        return $this->hasMany(TrackingSurat::class, 'ke_user_id');
    }

    // Disposisi yang dikirim user ini
    public function disposisiDari()
    {
        return $this->hasMany(Disposisi::class, 'dari_user_id');
    }

    // Disposisi yang diterima user ini
    public function disposisiKe()
    {
        return $this->hasMany(Disposisi::class, 'ke_user_id');
    }

    // Mutator untuk password agar otomatis di-hash
    public function setPasswordAttribute($password)
    {
        if (\Illuminate\Support\Facades\Hash::needsRehash($password)) {
            $this->attributes['password'] = bcrypt($password);
        } else {
            $this->attributes['password'] = $password;
        }
    }

    // Scope user aktif
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}