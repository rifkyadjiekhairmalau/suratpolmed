<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JabatanStruktural extends Model
{
    protected $table = 'jabatan_struktural';

    protected $fillable = [
        'jabatan_struktural',
    ];

    /**
     * Relasi: satu jabatan struktural bisa dimiliki oleh banyak user
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'jabatan_struktural_id');
    }

    /**
     * Relasi: satu jabatan struktural bisa dimiliki oleh banyak pegawai
     */
    public function pegawais(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'jabatan_struktural_id');
    }
}