<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Pegawai;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $jumlahMahasiswa = Mahasiswa::count();
        $jumlahPegawai = Pegawai::count();
        $jumlahUser = User::count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'user' => \App\Models\User::count(),
                'pegawai' => \App\Models\Pegawai::count(),
                'mahasiswa' => \App\Models\Mahasiswa::count(),
            ],
        ]);
    }
}
