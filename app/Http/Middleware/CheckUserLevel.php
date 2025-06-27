<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserLevel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$levels  Daftar nama level user yang diizinkan (misalnya: 'administrator', 'mahasiswa')
     */
    public function handle(Request $request, Closure $next, ...$levels): Response
    {
        // Pastikan user sudah login
        if (! $request->user()) {
            // Jika belum login, arahkan ke halaman login
            return redirect('/login');
        }

        // Ambil nama level user dari user yang sedang login
        // Diasumsikan ada relasi 'levelUser' dari model User ke model LevelUser
        // dan LevelUser punya kolom 'nama_level'
        $userLevel = $request->user()->levelUser->nama_level ?? null;

        // Cek apakah level user yang login ada di dalam daftar level yang diizinkan
        if (! in_array($userLevel, $levels)) {
            // Jika tidak diizinkan, arahkan ke dashboard yang sesuai atau berikan error 403
            switch ($userLevel) {
                case 'administrator': return redirect()->route('admin.dashboard');
                case 'mahasiswa': return redirect()->route('mahasiswa.dashboard');
                case 'pegawai': return redirect()->route('pegawai.dashboard');
                case 'administrasi umum': return redirect()->route('administrasi_umum.dashboard');
                case 'direktur': return redirect()->route('direktur.dashboard');
                case 'wakil direktur': return redirect()->route('wakil_direktur.dashboard');
                case 'kepala bagian': return redirect()->route('kepala_bagian.dashboard');
                case 'kepala sub bagian': return redirect()->route('kepala_sub_bagian.dashboard');
                default: abort(403, 'Unauthorized access.'); // Default jika level tidak cocok
            }
        }

        return $next($request); // Jika level diizinkan, lanjutkan request
    }
}