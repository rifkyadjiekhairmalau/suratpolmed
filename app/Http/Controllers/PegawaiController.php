<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\Jabatan;
use App\Models\JabatanStruktural;
use App\Models\JenisPegawai;
use App\Models\User; // Pastikan model User sudah diimpor
use App\Models\LevelUser; // Pastikan model LevelUser sudah diimpor
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Pastikan Hash facade sudah diimpor
use Illuminate\Validation\Rule;
// use Illuminate\Support\Facades\DB; // Dihapus untuk mengikuti gaya MahasiswaController yang tidak pakai transaksi eksplisit
// use Illuminate\Support\Facades\Log; // Dihapus karena MahasiswaController tidak menggunakannya untuk ini
use Inertia\Inertia;
// use Throwable; // Dihapus karena MahasiswaController tidak menggunakannya untuk ini

class PegawaiController extends Controller
{
    /**
     * Tampilkan daftar pegawai beserta relasi jabatan, jabatan struktural, dan jenis pegawai.
     */
    public function index()
    {
        return Inertia::render('Admin/Pegawai/index', [
            'pegawai' => Pegawai::with(['jabatan', 'jabatanStruktural', 'jenisPegawai'])
                ->orderBy('nama')
                ->get()
                ->map(function ($pegawai) {
                    return [
                        'id' => $pegawai->id,
                        'nip' => $pegawai->nip,
                        'gelar_depan' => $pegawai->gelar_depan,
                        'nama' => $pegawai->nama,
                        'gelar_belakang' => $pegawai->gelar_belakang,
                        'tempat_lahir' => $pegawai->tempat_lahir,
                        // 'tgl_lahir' => $pegawai->tgl_lahir, // Sudah dihilangkan
                        'email' => $pegawai->email,
                        'jabatan_id' => $pegawai->jabatan_id,
                        'jabatan_struktural_id' => $pegawai->jabatan_struktural_id,
                        'jenis_pegawai_id' => $pegawai->jenis_pegawai_id,
                        'jabatan' => $pegawai->jabatan->nama_jabatan ?? '-',
                        'jabatan_struktural' => $pegawai->jabatanStruktural->jabatan_struktural ?? '-',
                        'jenis_pegawai' => $pegawai->jenisPegawai->jenis_pegawai ?? '-',
                    ];
                }),
            'jabatanOptions' => Jabatan::orderBy('nama_jabatan')->get()->map(function ($jabatan) {
                return [
                    'id' => $jabatan->id,
                    'nama_jabatan' => $jabatan->nama_jabatan,
                ];
            }),
            'jabatanStrukturalOptions' => JabatanStruktural::orderBy('jabatan_struktural')->get()->map(function ($jabatan) {
                return [
                    'id' => $jabatan->id,
                    'jabatan_struktural' => $jabatan->jabatan_struktural,
                ];
            }),
            'jenisPegawaiOptions' => JenisPegawai::orderBy('jenis_pegawai')->get()->map(function ($jenis) {
                return [
                    'id' => $jenis->id,
                    'jenis_pegawai' => $jenis->jenis_pegawai,
                ];
            }),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Simpan data pegawai baru dan buatkan akun user-nya secara otomatis.
     */
    public function store(Request $request)
    {
        $dataPegawai = $request->validate([
            'nip' => 'required|string|max:30|unique:pegawai,nip',
            'gelar_depan' => 'nullable|string|max:50',
            'nama' => 'required|string|max:100',
            'gelar_belakang' => 'nullable|string|max:50',
            'tempat_lahir' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'jabatan_id' => 'required|exists:jabatan,id',
            'jabatan_struktural_id' => 'nullable|exists:jabatan_struktural,id',
            'jenis_pegawai_id' => 'required|exists:jenis_pegawai,id',
        ]);

        // Ubah string kosong menjadi null untuk jabatan_struktural_id jika diperlukan
        $dataPegawai['jabatan_struktural_id'] = $dataPegawai['jabatan_struktural_id'] === '' ? null : $dataPegawai['jabatan_struktural_id'];

        // 1. Buat Data Pegawai
        $pegawai = Pegawai::create($dataPegawai);

        // 2. Buat Data User untuk Pegawai ini
        $levelPegawai = LevelUser::where('nama_level', 'pegawai')->first();
        // Fallback untuk level_user_id, mirip MahasiswaController
        $levelUserIdPegawai = $levelPegawai ? $levelPegawai->id : 3; // Default ke 2 jika 'pegawai' tidak ditemukan

        User::create([
            'username' => $pegawai->nip,
            'name' => $pegawai->nama,
            'password' => Hash::make('password123'), // Password default
            'level_user_id' => $levelUserIdPegawai,
            'pegawai_id' => $pegawai->id, // Kaitkan user dengan pegawai
            'jabatan_struktural_id' => $dataPegawai['jabatan_struktural_id'], // Terapkan nilai nullable dari request
            'status' => 'aktif',
        ]);

        return back()->with('success', 'Data pegawai dan akun user berhasil ditambahkan!');
    }

    /**
     * Perbarui data pegawai dan akun user terkait.
     */
    public function update(Request $request, $id)
    {
        $pegawai = Pegawai::findOrFail($id);

        $dataPegawai = $request->validate([
            'nip' => ['required', 'string', 'max:30', Rule::unique('pegawai', 'nip')->ignore($pegawai->id)],
            'gelar_depan' => 'nullable|string|max:50',
            'nama' => 'required|string|max:100',
            'gelar_belakang' => 'nullable|string|max:50',
            'tempat_lahir' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'jabatan_id' => 'required|exists:jabatan,id',
            'jabatan_struktural_id' => 'nullable|exists:jabatan_struktural,id',
            'jenis_pegawai_id' => 'required|exists:jenis_pegawai,id',
        ]);

        // Ubah string kosong menjadi null untuk jabatan_struktural_id jika diperlukan
        $dataPegawai['jabatan_struktural_id'] = $dataPegawai['jabatan_struktural_id'] === '' ? null : $dataPegawai['jabatan_struktural_id'];

        // Simpan NIP dan Nama lama sebelum update pegawai
        $oldNip = $pegawai->nip;
        $oldNama = $pegawai->nama;

        // Perbarui data pegawai
        $pegawai->update($dataPegawai);

        // Perbarui data user terkait (jika ada perubahan pada NIP atau Nama atau Jabatan Struktural)
        $user = User::where('pegawai_id', $pegawai->id)->first();

        $levelPegawai = LevelUser::where('nama_level', 'pegawai')->first();
        $levelUserIdPegawai = $levelPegawai ? $levelPegawai->id : 2; // Fallback untuk level_user_id

        if ($user) {
            $updateUserData = [];

            // Jika NIP berubah, perbarui username user
            if ($oldNip !== $dataPegawai['nip']) {
                $updateUserData['username'] = $dataPegawai['nip'];
            }

            // Jika Nama berubah, perbarui nama user
            if ($oldNama !== $dataPegawai['nama']) {
                $updateUserData['name'] = $dataPegawai['nama'];
            }

            // Perbarui jabatan struktural dan level user (selalu update jika berubah dari form)
            $updateUserData['jabatan_struktural_id'] = $dataPegawai['jabatan_struktural_id'];
            $updateUserData['level_user_id'] = $levelUserIdPegawai;

            // Lakukan update user hanya jika ada data yang perlu diupdate
            if (!empty($updateUserData)) {
                $user->update($updateUserData);
            }
        } else {
            // Fallback: Jika entah kenapa user belum ada, buat user baru
            User::create([
                'username' => $dataPegawai['nip'],
                'name' => $dataPegawai['nama'],
                'password' => Hash::make('password123'),
                'level_user_id' => $levelUserIdPegawai,
                'pegawai_id' => $pegawai->id,
                'jabatan_struktural_id' => $dataPegawai['jabatan_struktural_id'],
                'status' => 'aktif',
            ]);
        }

        return back()->with('success', 'Data pegawai dan akun user berhasil diperbarui!');
    }

    /**
     * Hapus data pegawai dan akun user terkait.
     */
    public function destroy($id)
    {
        $pegawai = Pegawai::findOrFail($id);

        // Cari user yang terkait dengan pegawai ini
        $user = User::where('pegawai_id', $pegawai->id)->first();

        // Hapus user jika ditemukan
        if ($user) {
            $user->delete();
        }

        // Hapus data pegawai
        $pegawai->delete();

        return back()->with('success', 'Data pegawai dan akun user berhasil dihapus!');
    }
}