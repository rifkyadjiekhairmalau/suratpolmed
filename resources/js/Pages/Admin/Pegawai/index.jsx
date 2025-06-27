import React, { useState, useEffect, useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import Swal from "sweetalert2";

// Modal Form Pegawai
const PegawaiFormModal = ({
    pegawai,
    onClose,
    jabatanOptions,
    jabatanStrukturalOptions,
    jenisPegawaiOptions,
    isEdit,
}) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nip: pegawai?.nip || "",
        gelar_depan: pegawai?.gelar_depan || "",
        nama: pegawai?.nama || "",
        gelar_belakang: pegawai?.gelar_belakang || "",
        tempat_lahir: pegawai?.tempat_lahir || "",
        email: pegawai?.email || "",
        jabatan_id: pegawai?.jabatan_id || "",
        jabatan_struktural_id: pegawai?.jabatan_struktural_id || "",
        jenis_pegawai_id: pegawai?.jenis_pegawai_id || "",
    });

    useEffect(() => {
        reset();
    }, [pegawai]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const action = isEdit
            ? put(route("admin.pegawai.update", pegawai.id))
            : post(route("admin.pegawai.store"));

        action({
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: isEdit
                        ? "Data pegawai berhasil diperbarui."
                        : "Data pegawai berhasil ditambahkan.",
                    timer: 2500,
                    showConfirmButton: false,
                });
                onClose();
            },
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Periksa kembali data yang diisi.",
                });
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl p-6 w-full max-w-xl"
            >
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? "Edit Pegawai" : "Tambah Pegawai"}
                </h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="NIP"
                        value={data.nip}
                        onChange={(e) => setData("nip", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Gelar Depan"
                        value={data.gelar_depan}
                        onChange={(e) => setData("gelar_depan", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Nama"
                        value={data.nama}
                        onChange={(e) => setData("nama", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Gelar Belakang"
                        value={data.gelar_belakang}
                        onChange={(e) => setData("gelar_belakang", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Tempat Lahir"
                        value={data.tempat_lahir}
                        onChange={(e) => setData("tempat_lahir", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <select
                        value={data.jabatan_id}
                        onChange={(e) => setData("jabatan_id", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Pilih Jabatan</option>
                        {jabatanOptions.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.nama_jabatan}
                            </option>
                        ))}
                    </select>
                    <select
                        value={data.jabatan_struktural_id || ""}
                        onChange={(e) =>
                            setData("jabatan_struktural_id", e.target.value)
                        }
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Tidak Ada Jabatan Struktural</option>
                        {jabatanStrukturalOptions.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.jabatan_struktural}
                            </option>
                        ))}
                    </select>
                    <select
                        value={data.jenis_pegawai_id}
                        onChange={(e) => setData("jenis_pegawai_id", e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">Pilih Jenis Pegawai</option>
                        {jenisPegawaiOptions.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.jenis_pegawai}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 text-white rounded"
                        disabled={processing}
                    >
                        {processing ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function KelolaPegawai({
    auth,
    pegawai,
    jabatanOptions,
    jabatanStrukturalOptions,
    jenisPegawaiOptions,
    flash,
}) {
    const [modalState, setModalState] = useState(null);
    const [selectedPegawai, setSelectedPegawai] = useState(null);
    const { delete: destroy, processing: deleting } = useForm();

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "Sukses",
                text: flash.success,
                timer: 3000,
                showConfirmButton: false,
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: flash.error,
            });
        }
    }, [flash]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data tidak dapat dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("admin.pegawai.destroy", id), {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pegawai" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Pegawai
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tambah, edit, atau hapus data pegawai.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedPegawai(null);
                        setModalState("form");
                    }}
                    className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700"
                >
                    Tambah Pegawai
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow">
                <table className="w-full">
                    <thead>
                        <tr className="bg-purple-100 text-left text-sm font-semibold">
                            <th className="px-4 py-2">NIP</th>
                            <th className="px-4 py-2">Nama</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Jabatan</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pegawai.map((p) => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{p.nip}</td>
                                <td className="px-4 py-2">{p.nama}</td>
                                <td className="px-4 py-2">{p.email}</td>
                                <td className="px-4 py-2">{p.jabatan}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPegawai(p);
                                            setModalState("form");
                                        }}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalState === "form" && (
                <PegawaiFormModal
                    onClose={() => setModalState(null)}
                    isEdit={!!selectedPegawai}
                    pegawai={selectedPegawai}
                    jabatanOptions={jabatanOptions}
                    jabatanStrukturalOptions={jabatanStrukturalOptions}
                    jenisPegawaiOptions={jenisPegawaiOptions}
                />
            )}
        </AdminLayout>
    );
}
