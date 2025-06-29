<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrackingSurat extends Model
{
    use HasFactory;

    protected $table = 'tracking_surat';

    protected $fillable = [
        'surat_masuk_id',
        'status_surat_id',
        'dari_user_id',
        'ke_user_id',
        'catatan',
    ];

    public function surat()
    {
        return $this->belongsTo(SuratMasuk::class, 'surat_masuk_id');
    }

    public function status()
    {
        return $this->belongsTo(StatusSurat::class, 'status_surat_id');
    }

    public function dariUser()
    {
        return $this->belongsTo(User::class, 'dari_user_id');
    }

    public function keUser()
    {
        return $this->belongsTo(User::class, 'ke_user_id');
    }
}