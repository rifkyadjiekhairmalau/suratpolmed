<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\LevelUser;
use App\Models\JabatanStruktural; // <-- Import model JabatanStruktural
use App\Models\Mahasiswa; // Mungkin tetap perlu jika jabatan dari Mahasiswa
use App\Models\Pegawai; // Mungkin tetap perlu jika jabatan dari Pegawai
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        // Ambil semua user, preload relasi levelUser, mahasiswa, pegawai, dan jabatanStruktural
        $users = User::with(['levelUser', 'mahasiswa', 'pegawai', 'jabatanStruktural']) // Tambah jabatanStruktural
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    // 'email' => $user->email ?? '-', // <-- HAPUS BARIS INI (karena tidak ada di tabel users)
                    'role' => $user->levelUser->nama_level ?? 'N/A', // Ambil nama level
                    // Logika untuk menampilkan jabatan:
                    // Prioritas: Jabatan Struktural > Mahasiswa > Pegawai > Default
                    'jabatan' => $user->jabatanStruktural->jabatan_struktural ??
                                 ($user->mahasiswa ? 'Mahasiswa' : ($user->pegawai->jabatan_pegawai ?? 'N/A')),
                    'status' => ucfirst($user->status),
                    'level_user_id' => $user->level_user_id, // Penting untuk edit form
                    'jabatan_struktural_id' => $user->jabatan_struktural_id, // Penting untuk edit form
                ];
            });

        // Ambil semua level user untuk dropdown filter dan form
        $levelOptions = LevelUser::all()->map(function ($level) {
            return [
                'id' => $level->id,
                'nama' => $level->nama_level,
            ];
        })->prepend(['id' => 'all', 'nama' => 'Semua Role']);

        // Ambil semua jabatan struktural untuk dropdown di form modal
        $jabatanStrukturalOptions = JabatanStruktural::all()->map(function ($jabatan) {
            return [
                'id' => $jabatan->id,
                'nama_jabatan' => $jabatan->jabatan_struktural, // Sesuaikan dengan nama kolom di tabel
            ];
        });

        return Inertia::render('Admin/Pengguna/index', [
            'users' => $users,
            'roleOptions' => $levelOptions,
            'jabatanStrukturalOptions' => $jabatanStrukturalOptions, // <-- Kirim ini ke frontend
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:8',
            'level_user_id' => 'required|exists:level_user,id',
            'jabatan_struktural_id' => 'nullable|exists:jabatan_struktural,id', // 'nullable' karena tidak semua user punya jabatan struktural
            'mahasiswa_id' => 'nullable|exists:mahasiswa,id', // Biarkan nullable
            'pegawai_id' => 'nullable|exists:pegawai,id', // Biarkan nullable
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return back()->with('success', 'Pengguna berhasil ditambahkan!');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'level_user_id' => 'required|exists:level_user,id',
            'jabatan_struktural_id' => 'nullable|exists:jabatan_struktural,id', // 'nullable' untuk update juga
            'mahasiswa_id' => 'nullable|exists:mahasiswa,id',
            'pegawai_id' => 'nullable|exists:pegawai,id',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return back()->with('success', 'Pengguna berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'Pengguna berhasil dihapus!');
    }

    public function toggleStatus(User $user)
    {
        $newStatus = ($user->status === 'aktif') ? 'nonaktif' : 'aktif';
        $user->update(['status' => $newStatus]);

        return back()->with('success', 'Status pengguna berhasil diubah menjadi ' . $newStatus . '.');
    }
}