<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LevelUser extends Model
{
    protected $table = 'level_user';

    protected $fillable = [
        'nama_level',
    ];

    // Relasi ke User, satu level bisa dimiliki banyak user
    public function users()
    {
        return $this->hasMany(User::class, 'level_user_id');
    }
}