import React, { useState, useMemo, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import Swal from "sweetalert2"; // Pastikan Anda sudah menginstal: npm install sweetalert2

// --- Komponen MahasiswaFormModal ---
// Komponen ini akan memiliki useForm() sendiri dan menangani submit langsung
const MahasiswaFormModal = ({ mahasiswa, onClose, prodiOptions, isEdit }) => {
    // Inisialisasi useForm() untuk modal ini
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nim: mahasiswa?.nim || "",
        nama: mahasiswa?.nama || "",
        prodi_id: mahasiswa?.prodi_id || prodiOptions[0]?.id || "", // Pastikan prodi_id ada di props mahasiswa
    });

    useEffect(() => {
        setData({
            nim: mahasiswa?.nim || "",
            nama: mahasiswa?.nama || "",
            prodi_id: mahasiswa?.prodi_id || prodiOptions[0]?.id || "",
        });
        reset(); // Reset errors dan processing state dari form ini
    }, [mahasiswa, prodiOptions, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi frontend dasar (opsional, tapi bagus untuk UX)
        if (!data.nim || !data.nama || !data.prodi_id) {
            Swal.fire({
                icon: "warning",
                title: "Input Tidak Lengkap",
                text: "Semua field harus diisi!",
            });
            return;
        }

        if (isEdit) {
            put(route("admin.mahasiswa.update", mahasiswa.id), {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil!",
                        text: "Data mahasiswa berhasil diperbarui.",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                    onClose(); // Tutup modal setelah berhasil
                },
                onError: (validationErrors) => {
                    console.error("Validation Errors:", validationErrors);
                    Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal!",
                        text: "Silakan periksa kembali input Anda.",
                    });
                    // errors dari useForm akan otomatis terisi dan ditampilkan di UI
                },
                preserveScroll: true, // Opsional: mempertahankan posisi scroll
            });
        } else {
            // Mode Tambah
            post(route("admin.mahasiswa.store"), {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil!",
                        text: "Data mahasiswa berhasil ditambahkan.",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                    onClose(); // Tutup modal setelah berhasil
                },
                onError: (validationErrors) => {
                    console.error("Validation Errors:", validationErrors);
                    Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal!",
                        text: "Silakan periksa kembali input Anda.",
                    });
                    // errors dari useForm akan otomatis terisi dan ditampilkan di UI
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa Baru"}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            NIM
                        </label>
                        <input
                            type="text"
                            name="nim"
                            value={data.nim}
                            onChange={(e) => setData("nim", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required
                        />
                        {errors.nim && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.nim}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required
                        />
                        {errors.nama && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.nama}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Program Studi
                        </label>
                        <select
                            name="prodi_id"
                            value={data.prodi_id}
                            onChange={(e) =>
                                setData("prodi_id", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required // Tambahkan required di sini juga
                        >
                            <option value="">-- Pilih Program Studi --</option>{" "}
                            {/* Opsi default */}
                            {prodiOptions.map((prodi) => (
                                <option key={prodi.id} value={prodi.id}>
                                    {prodi.nama}
                                </option>
                            ))}
                        </select>
                        {errors.prodi_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.prodi_id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                        disabled={processing} // Nonaktifkan tombol saat form sedang diproses
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition"
                        disabled={processing} // Nonaktifkan tombol saat form sedang diproses
                    >
                        {processing ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Komponen DeleteConfirmModal ---
const DeleteConfirmModal = ({ mahasiswa, onClose, onConfirm, processing }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Konfirmasi Hapus
            </h2>
            <p className="text-gray-600">
                Anda yakin ingin menghapus data mahasiswa{" "}
                <strong className="font-semibold">{mahasiswa.nama}</strong> (
                {mahasiswa.nim})?
            </p>
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={onClose}
                    className="px-6 py-2 border rounded-lg"
                    disabled={processing}
                >
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold"
                    disabled={processing}
                >
                    {processing ? "Menghapus..." : "Ya, Hapus"}
                </button>
            </div>
        </div>
    </div>
);

// --- Komponen Pagination (MODIFIKASI: Tampilan 5 halaman & estetika) ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 4; // Maksimal 5 tombol angka halaman yang terlihat
        const halfMax = Math.floor(maxPagesToShow / 3);

        let startPage = Math.max(1, currentPage - halfMax);
        let endPage = Math.min(totalPages, currentPage + halfMax);

        // Menyesuaikan startPage dan endPage jika terlalu dekat dengan ujung
        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, totalPages - maxPagesToShow + 1);
            }
        }

        // Tambahkan tombol halaman
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Tambahkan elipsis dan halaman pertama/terakhir jika diperlukan
        if (startPage > 1) {
            if (startPage > 2) pageNumbers.unshift("..."); // Elipsis jika ada lebih dari 1 halaman di antara 1 dan startPage
            pageNumbers.unshift(1); // Selalu tampilkan halaman pertama
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push("..."); // Elipsis jika ada lebih dari 1 halaman di antara endPage dan totalPages
            pageNumbers.push(totalPages); // Selalu tampilkan halaman terakhir
        }

        // Gunakan Set untuk menghilangkan duplikasi (misal: jika totalPages <= maxPagesToShow)
        // Kemudian urutkan kembali (penting karena unshift/push elipsis)
        return [...new Set(pageNumbers)].sort((a, b) => {
            if (a === "...") return -1; // Elipsis harus selalu di awal/akhir bloknya
            if (b === "...") return 1;
            return a - b;
        });
    };

    return (
        <nav
            className="flex items-center justify-center space-x-2 mt-6" // Diubah: gap-4 menjadi space-x-2
            aria-label="Pagination"
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                &laquo; Prev
            </button>
            <div className="flex items-center space-x-2">
                {" "}
                {/* Diubah: gap-2 menjadi space-x-2 */}
                {getPageNumbers().map((num, index) =>
                    num === "..." ? (
                        <span
                            key={index}
                            className="flex items-center justify-center text-gray-500"
                        ></span> // Menambahkan kembali '...'
                    ) : (
                        <button
                            key={num}
                            onClick={() => onPageChange(num)}
                            className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                                currentPage === num
                                    ? "bg-violet-600 text-white shadow-lg" // Menambahkan scale-105 untuk efek hover
                                    : "bg-white text-gray-700 hover:text-violet-600" // Diubah: border dihilangkan, bg-white menjadi bg-gray-100
                            }`}
                            aria-current={
                                currentPage === num ? "page" : undefined
                            }
                        >
                            {num}
                        </button>
                    )
                )}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                Next &raquo;
            </button>
        </nav>
    );
};

// --- Komponen Utama KelolaMahasiswa ---
export default function KelolaMahasiswa({
    auth,
    mahasiswa,
    prodiOptions,
    flash,
}) {
    const [modalState, setModalState] = useState(null);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Gunakan useForm hanya untuk operasi delete di komponen ini
    const { delete: destroy, processing: deleteProcessing } = useForm();

    // -- DEFINISI handlePageChange yang hilang, KINI DITAMBAHKAN KEMBALI --
    const handlePageChange = (page) => {
        // Pastikan halaman yang diminta valid sebelum update currentPage
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // ---------------------------------------------------------------------

    // Pastikan data mahasiswa diolah agar prodi dan jurusan siap ditampilkan
    const processedMahasiswa = useMemo(() => {
        return mahasiswa.map((mhs) => ({
            ...mhs,
            // Cari nama prodi dan jurusan dari prodiOptions yang diberikan
            prodi: prodiOptions.find((p) => p.id === mhs.prodi_id)?.nama || "-",
            jurusan:
                prodiOptions.find((p) => p.id === mhs.prodi_id)?.jurusan || "-",
        }));
    }, [mahasiswa, prodiOptions]);

    const filteredMahasiswa = useMemo(() => {
        return processedMahasiswa.filter(
            (mhs) =>
                mhs.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mhs.nim.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [processedMahasiswa, searchQuery]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredMahasiswa.length / ITEMS_PER_PAGE);
        const paginatedData = filteredMahasiswa.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
        return { paginatedData, totalPages };
    }, [filteredMahasiswa, currentPage, ITEMS_PER_PAGE]);

    // Menampilkan flash messages (sukses/error) dari backend
    useEffect(() => {
        if (flash && flash.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                timer: 3000,
                showConfirmButton: false,
            });
        }
        if (flash && flash.error) {
            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan!",
                text: flash.error,
            });
        }
    }, [flash]);

    const handleOpenModal = (type, mhs = null) => {
        setSelectedMahasiswa(mhs);
        setModalState(type);
        // Tidak perlu reset useForm utama karena hanya untuk delete dan itu sudah dikelola di MahasiswaFormModal
    };

    const handleCloseModal = () => {
        setModalState(null);
        setSelectedMahasiswa(null);
    };

    const handleDelete = () => {
        if (!selectedMahasiswa) return;

        destroy(route("admin.mahasiswa.destroy", selectedMahasiswa.id), {
            onSuccess: () => {
                handleCloseModal(); // Tutup modal setelah berhasil
                Swal.fire({
                    icon: "success",
                    title: "Berhasil Dihapus!",
                    text: "Data mahasiswa telah dihapus.",
                    timer: 3000,
                    showConfirmButton: false,
                });
            },
            onError: (deleteErrors) => {
                console.error("Delete Error:", deleteErrors);
                Swal.fire({
                    icon: "error",
                    title: "Gagal Menghapus!",
                    text: "Terjadi kesalahan saat menghapus data.",
                });
            },
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Mahasiswa" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Mahasiswa
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tambah, edit, atau hapus data mahasiswa.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal("add")}
                    className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition shadow-sm"
                >
                    Tambah Mahasiswa
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari Nama atau NIM..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset halaman ke 1 saat mencari
                        }}
                        className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-100">
                            <tr>
                                <th
                                    style={{ width: "5%" }}
                                    className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase"
                                >
                                    NIM
                                </th>
                                <th
                                    style={{ width: "25%" }}
                                    className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase"
                                >
                                    Nama
                                </th>
                                <th
                                    style={{ width: "30%" }}
                                    className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase"
                                >
                                    Prodi
                                </th>
                                <th
                                    style={{ width: "30%" }}
                                    className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase"
                                >
                                    Jurusan
                                </th>
                                <th
                                    style={{ width: "5%" }}
                                    className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase"
                                >
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map((mhs) => (
                                <tr
                                    key={mhs.id}
                                    className="hover:bg-gray-50/50"
                                >
                                    <td
                                        style={{ width: "15%" }}
                                        className="px-6 py-4 text-gray-600"
                                    >
                                        {mhs.nim}
                                    </td>
                                    <td
                                        style={{ width: "30%" }}
                                        className="px-6 py-4 text-gray-600 font-medium"
                                    >
                                        {mhs.nama}
                                    </td>
                                    <td
                                        style={{ width: "25%" }}
                                        className="px-6 py-4 text-gray-600"
                                    >
                                        {mhs.prodi}
                                    </td>
                                    <td
                                        style={{ width: "20%" }}
                                        className="px-6 py-4 text-gray-600"
                                    >
                                        {mhs.jurusan}
                                    </td>
                                    <td
                                        style={{ width: "10%" }}
                                        className="px-6 py-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleOpenModal("edit", mhs)
                                                }
                                                className="p-2 text-amber-600 hover:bg-amber-100 rounded-full"
                                                title="Edit"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleOpenModal(
                                                        "delete",
                                                        mhs
                                                    )
                                                }
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                                title="Hapus"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMahasiswa.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5} // Jumlah kolom adalah 5 (NIM, Nama, Prodi, Jurusan, Aksi)
                                        className="text-center py-10 text-gray-400"
                                    >
                                        Data mahasiswa tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange} // Ini yang memanggil handlePageChange
                />
            </div>

            {/* Render MahasiswaFormModal */}
            {modalState === "add" && (
                <MahasiswaFormModal
                    onClose={handleCloseModal}
                    prodiOptions={prodiOptions}
                    mahasiswa={null} // Tidak ada data mahasiswa untuk mode tambah
                    isEdit={false}
                />
            )}
            {modalState === "edit" && selectedMahasiswa && (
                <MahasiswaFormModal
                    onClose={handleCloseModal}
                    prodiOptions={prodiOptions}
                    mahasiswa={selectedMahasiswa} // Teruskan data mahasiswa untuk edit
                    isEdit={true}
                />
            )}
            {/* Render DeleteConfirmModal */}
            {modalState === "delete" && selectedMahasiswa && (
                <DeleteConfirmModal
                    onClose={handleCloseModal}
                    onConfirm={handleDelete}
                    mahasiswa={selectedMahasiswa}
                    processing={deleteProcessing} // Teruskan processing dari useForm delete
                />
            )}
        </AdminLayout>
    );
}
