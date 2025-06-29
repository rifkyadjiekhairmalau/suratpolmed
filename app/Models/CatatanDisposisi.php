<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatatanDisposisi extends Model
{
    protected $table = 'catatan_disposisi';

    protected $fillable = [
        'isi_catatan',
    ];

    public function disposisi()
    {
        return $this->hasMany(Disposisi::class, 'catatan_disposisi_id');
    }

}