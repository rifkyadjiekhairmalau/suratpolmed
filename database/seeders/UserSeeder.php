<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            [
                'username' => 'administrator',
                'name' => 'Administrator',
                'password' => Hash::make('admin123'),
                'level_user_id' => 1, // Administrator
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => null,
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'direktur',
                'name' => 'Direktur',
                'password' => Hash::make('direktur123'),
                'level_user_id' => 5, // Direktur
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 1,
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'wadirakademik',
                'name' => 'Wakil Direktur Akademik',
                'password' => Hash::make('wadirakademik123'),
                'level_user_id' => 6, // Wakil Direktur
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 91,
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'wadirpku',
                'name' => 'Wakil Direktur Perencanaan Keuangan dan Umum',
                'password' => Hash::make('wadirpku123'),
                'level_user_id' => 6, // Wakil Direktur
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 92,
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'wadirkm',
                'name' => 'Wakil Direktur Kemahasiswaan',
                'password' => Hash::make('wadirkm123'),
                'level_user_id' => 6, // Wakil Direktur
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 93, 
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'wadirhumas',
                'name' => 'Wakil Direktur Kerjasama dan Hubungan Masyarakat',
                'password' => Hash::make('wadirhumas123'),
                'level_user_id' => 6,
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 94, 
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'kabagpku',
                'name' => 'Kepala Bagian Perencanaan Keuangan dan Umum',
                'password' => Hash::make('kabagpku123'),
                'level_user_id' => 7, // Kepala Bagian
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 95, 
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'kabagakk',
                'name' => 'Kepala Bagian Akademik Kemahasiswaan dan Kerjasama',
                'password' => Hash::make('kabagakk123'),
                'level_user_id' => 7, // Kepala Bagian
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 96, 
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'kasubagumum',
                'name' => 'Kepala Sub Bagian Umum',
                'password' => Hash::make('kasubagumum123'),
                'level_user_id' => 8, // Kepala Sub Bagian
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 97, 
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'kasubagakk',
                'name' => 'Kepala Sub Bagian Akademik',
                'password' => Hash::make('kasubagakk123'),
                'level_user_id' => 8,
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 98,
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'administrasiumum',
                'name' => 'Administrasi Umum',
                'password' => Hash::make('adminumum123'),
                'level_user_id' => 4, // Admin Umum
                'mahasiswa_id' => null,
                'pegawai_id' => null,
                'jabatan_struktural_id' => 63,
                'status' => 'aktif',
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}