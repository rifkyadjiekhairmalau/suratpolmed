<?php

namespace App\Http\Controllers;

use App\Models\User; // Pastikan model User sudah diimpor
use Inertia\Inertia;
use App\Models\Prodi;
use App\Models\LevelUser;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class MahasiswaController extends Controller
{
    /**
     * Tampilkan daftar mahasiswa beserta prodi & jurusan.
     */
    public function index()
    {
        return Inertia::render('Admin/Mahasiswa/index', [
            'mahasiswa' => Mahasiswa::with('prodi.jurusan')
                ->orderBy('nama')
                ->get()
                ->map(function ($mhs) {
                    return [
                        'id' => $mhs->id,
                        'nim' => $mhs->nim,
                        'nama' => $mhs->nama,
                        'prodi_id' => $mhs->prodi_id, // Pastikan prodi_id disertakan di sini!
                        'prodi' => $mhs->prodi->nama_prodi ?? '-',
                        'jurusan' => $mhs->prodi->jurusan->nama_jurusan ?? '-',
                    ];
                }),
            'prodiOptions' => Prodi::with('jurusan')->get()->map(function ($prodi) {
                return [
                    'id' => $prodi->id,
                    'nama' => $prodi->nama_prodi,
                    'jurusan' => $prodi->jurusan->nama_jurusan ?? '-', // ini opsional
                ];
            }),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Simpan data mahasiswa baru dan buatkan akun user-nya.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nim' => 'required|string|max:30|unique:mahasiswa,nim',
            'nama' => 'required|string|max:100',
            'prodi_id' => 'required|exists:program_studi,id',
        ]);

        $prodi = Prodi::with('jurusan')->findOrFail($data['prodi_id']);
        $data['jurusan_id'] = $prodi->jurusan_id;

        // 1. Buat Data Mahasiswa
        $mahasiswa = Mahasiswa::create($data);

        // 2. Buat Data User untuk Mahasiswa ini
        $levelMahasiswa = LevelUser::where('nama_level', 'mahasiswa')->first();
        $levelUserIdMahasiswa = $levelMahasiswa ? $levelMahasiswa->id : 2; // Default ke 2 jika tidak ditemukan

        User::create([
            'username' => $mahasiswa->nim,
            'name' => $mahasiswa->nama,
            'password' => Hash::make('password123'), // Password default
            'level_user_id' => $levelUserIdMahasiswa,
            'mahasiswa_id' => $mahasiswa->id, // Kaitkan user dengan mahasiswa
            'status' => 'aktif',
        ]);

        return back()->with('success', 'Data mahasiswa dan akun user berhasil ditambahkan!');
    }

    /**
     * Perbarui data mahasiswa dan akun user terkait.
     */
    public function update(Request $request, $id)
    {
        $mahasiswa = Mahasiswa::findOrFail($id);

        $data = $request->validate([
            // Rule::unique di sini memastikan NIM unik kecuali untuk mahasiswa yang sedang diedit
            'nim' => ['required', 'string', 'max:30', Rule::unique('mahasiswa', 'nim')->ignore($mahasiswa->id)],
            'nama' => 'required|string|max:100',
            'prodi_id' => 'required|exists:program_studi,id',
        ]);

        $prodi = Prodi::with('jurusan')->findOrFail($data['prodi_id']);
        $data['jurusan_id'] = $prodi->jurusan_id;

        // Simpan NIM dan Nama lama sebelum update mahasiswa
        $oldNim = $mahasiswa->nim;
        $oldNama = $mahasiswa->nama;

        // Perbarui data mahasiswa
        $mahasiswa->update($data);

        // Perbarui data user terkait (jika ada perubahan pada NIM atau Nama)
        $user = User::where('mahasiswa_id', $mahasiswa->id)->first();

        if ($user) {
            $updateUserData = [];

            // Jika NIM berubah, perbarui username user
            if ($oldNim !== $mahasiswa->nim) {
                $updateUserData['username'] = $mahasiswa->nim;
            }

            // Jika Nama berubah, perbarui nama user
            if ($oldNama !== $mahasiswa->nama) {
                $updateUserData['name'] = $mahasiswa->nama;
            }

            // Lakukan update user hanya jika ada data yang perlu diupdate
            if (!empty($updateUserData)) {
                $user->update($updateUserData);
            }
        }

        return back()->with('success', 'Data mahasiswa dan akun user berhasil diperbarui!');
    }

    /**
     * Hapus data mahasiswa dan akun user terkait.
     */
    public function destroy($id)
    {
        $mahasiswa = Mahasiswa::findOrFail($id);

        // Cari user yang terkait dengan mahasiswa ini
        $user = User::where('mahasiswa_id', $mahasiswa->id)->first();

        // Hapus user jika ditemukan
        if ($user) {
            $user->delete();
        }

        // Hapus data mahasiswa
        $mahasiswa->delete();

        return back()->with('success', 'Data mahasiswa dan akun user berhasil dihapus!');
    }
}