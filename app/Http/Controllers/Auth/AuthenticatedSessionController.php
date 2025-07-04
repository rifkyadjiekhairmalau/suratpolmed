<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        // Ambil level user yang login
        $level = Auth::user()->levelUser->nama_level ?? null;

        // Redirect berdasarkan level user
        switch ($level) {
            case 'administrator':
                return redirect()->route('admin.dashboard');
            case 'mahasiswa':
            case 'pegawai':
                return redirect()->route('pengaju.suratmasuk.index');
            case 'administrasi umum':
                return redirect()->route('administrasi_umum.dashboard');
            case 'direktur':
            case 'wakil direktur':
            case 'kepala bagian':
                return redirect()->route('disposisi.menunggu');
            case 'kepala sub bagian':
                return redirect()->route('kasubag.menunggu');
            default:
                abort(403, 'Akses tidak diizinkan.');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
