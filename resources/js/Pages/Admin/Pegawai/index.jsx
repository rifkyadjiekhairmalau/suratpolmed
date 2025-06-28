import React, { useState, useEffect, useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import Swal from "sweetalert2";

// Impor ikon Font Awesome untuk tombol aksi
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

// --- KOMPONEN MODAL DETAIL PEGAWAI (DIMODIFIKASI: Hapus Tanggal Lahir) ---
const DetailPegawaiModal = ({ pegawai, onClose }) => {
    if (!pegawai) return null;

    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value || '-'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Pegawai</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailItem label="Nama Lengkap" value={`${pegawai.gelar_depan || ''} ${pegawai.nama} ${pegawai.gelar_belakang || ''}`.trim()} />
                    <DetailItem label="NIP" value={pegawai.nip} />
                    <DetailItem label="Email" value={pegawai.email} />
                    <DetailItem label="Tempat Lahir" value={pegawai.tempat_lahir} />
                    {/* Baris Tanggal Lahir dihilangkan sesuai permintaan */}
                    {/* <DetailItem label="Tanggal Lahir" value={formattedTglLahir} /> */}
                    <DetailItem label="Jabatan Fungsional" value={pegawai.jabatan?.nama_jabatan || '-'} />
                    <DetailItem label="Jabatan Struktural" value={pegawai.jabatan_struktural?.jabatan_struktural || '-'} />
                    <DetailItem label="Jenis Pegawai" value={pegawai.jenis_pegawai?.jenis_pegawai || '-'} />
                </div>
                <div className="flex justify-end mt-8 pt-6 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200">Tutup</button>
                </div>
            </div>
        </div>
    );
};

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
            if (startPage > 2) pageNumbers.unshift('...'); // Elipsis jika ada lebih dari 1 halaman di antara 1 dan startPage
            pageNumbers.unshift(1); // Selalu tampilkan halaman pertama
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push('...'); // Elipsis jika ada lebih dari 1 halaman di antara endPage dan totalPages
            pageNumbers.push(totalPages); // Selalu tampilkan halaman terakhir
        }

        // Gunakan Set untuk menghilangkan duplikasi (misal: jika totalPages <= maxPagesToShow)
        // Kemudian urutkan kembali (penting karena unshift/push elipsis)
        return [...new Set(pageNumbers)].sort((a, b) => {
            if (a === '...') return -1; // Elipsis harus selalu di awal/akhir bloknya
            if (b === '...') return 1;
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
            <div className="flex items-center space-x-2"> {/* Diubah: gap-2 menjadi space-x-2 */}
                {getPageNumbers().map((num, index) => (
                    num === '...' ? (
                        <span key={index} className="flex items-center justify-center text-gray-500"></span> // Menambahkan kembali '...'
                    ) : (
                        <button
                            key={num}
                            onClick={() => onPageChange(num)}
                            className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                                currentPage === num
                                    ? 'bg-violet-600 text-white shadow-lg' // Menambahkan scale-105 untuk efek hover
                                    : 'bg-white text-gray-700 hover:text-violet-600' // Diubah: border dihilangkan, bg-white menjadi bg-gray-100
                            }`}
                            aria-current={
                                currentPage === num ? "page" : undefined
                            }
                        >
                            {num}
                        </button>
                    )
                ))}
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


// --- KOMPONEN MODAL FORM PEGAWAI (Tidak ada perubahan fungsionalitas) ---
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
        tgl_lahir: pegawai?.tgl_lahir ? new Date(pegawai.tgl_lahir).toISOString().split('T')[0] : '',
        email: pegawai?.email || "",
        jabatan_id: pegawai?.jabatan_id || "",
        jabatan_struktural_id: pegawai?.jabatan_struktural_id || "",
        jenis_pegawai_id: pegawai?.jenis_pegawai_id || "",
    });

    useEffect(() => {
        setData({
            nip: pegawai?.nip || "",
            gelar_depan: pegawai?.gelar_depan || "",
            nama: pegawai?.nama || "",
            gelar_belakang: pegawai?.gelar_belakang || "",
            tempat_lahir: pegawai?.tempat_lahir || "",
            tgl_lahir: pegawai?.tgl_lahir ? new Date(pegawai.tgl_lahir).toISOString().split('T')[0] : '',
            email: pegawai?.email || "",
            jabatan_id: pegawai?.jabatan_id || "",
            jabatan_struktural_id: pegawai?.jabatan_struktural_id || "",
            jenis_pegawai_id: pegawai?.jenis_pegawai_id || "",
        });
        reset('errors');
    }, [pegawai]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitMethod = isEdit ? put : post;
        const routeName = isEdit ? route("admin.pegawai.update", pegawai.id) : route("admin.pegawai.store");

        submitMethod(routeName, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: isEdit ? "Data pegawai berhasil diperbarui." : "Data pegawai berhasil ditambahkan.",
                    timer: 2500,
                    showConfirmButton: false,
                });
                onClose();
            },
            onError: (formErrors) => {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Periksa kembali data yang diisi. " + Object.values(formErrors).flat().join(', '),
                });
            },
        });
    };

    const inputStyle = "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500";
    const labelStyle = "block text-sm font-bold text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEdit ? "Edit Pegawai" : "Tambah Pegawai Baru"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NIP - full width */}
                    <div className="md:col-span-2">
                        <label className={labelStyle}>NIP</label>
                        <input type="text" name="nip" value={data.nip} onChange={(e) => setData("nip", e.target.value)} className={inputStyle} required />
                        {errors.nip && <div className="text-red-500 text-sm mt-1">{errors.nip}</div>}
                    </div>

                    {/* Gelar Depan & Nama Lengkap */}
                    <div>
                        <label className={labelStyle}>Gelar Depan</label>
                        <input type="text" name="gelar_depan" value={data.gelar_depan} onChange={(e) => setData("gelar_depan", e.target.value)} className={inputStyle} />
                        {errors.gelar_depan && <div className="text-red-500 text-sm mt-1">{errors.gelar_depan}</div>}
                    </div>
                    <div>
                        <label className={labelStyle}>Nama Lengkap</label>
                        <input type="text" name="nama" value={data.nama} onChange={(e) => setData("nama", e.target.value)} className={inputStyle} required />
                        {errors.nama && <div className="text-red-500 text-sm mt-1">{errors.nama}</div>}
                    </div>

                    {/* Gelar Belakang & Email */}
                    <div>
                        <label className={labelStyle}>Gelar Belakang</label>
                        <input type="text" name="gelar_belakang" value={data.gelar_belakang} onChange={(e) => setData("gelar_belakang", e.target.value)} className={inputStyle} />
                        {errors.gelar_belakang && <div className="text-red-500 text-sm mt-1">{errors.gelar_belakang}</div>}
                    </div>
                    <div>
                        <label className={labelStyle}>Email</label>
                        <input type="email" name="email" value={data.email} onChange={(e) => setData("email", e.target.value)} className={inputStyle} required />
                        {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>

                    {/* Tempat Lahir & Tanggal Lahir */}
                    <div>
                        <label className={labelStyle}>Tempat Lahir</label>
                        <input type="text" name="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData("tempat_lahir", e.target.value)} className={inputStyle} required />
                        {errors.tempat_lahir && <div className="text-red-500 text-sm mt-1">{errors.tempat_lahir}</div>}
                    </div>

                    {/* Jabatan Fungsional & Jabatan Struktural */}
                    <div>
                        <label className={labelStyle}>Jabatan Fungsional</label>
                        <select value={data.jabatan_id} onChange={(e) => setData("jabatan_id", e.target.value)} className={inputStyle} required >
                            <option value="">Pilih Jabatan Fungsional</option>
                            {jabatanOptions.map((j) => (
                                <option key={j.id} value={j.id}>{j.nama_jabatan}</option>
                            ))}
                        </select>
                        {errors.jabatan_id && <div className="text-red-500 text-sm mt-1">{errors.jabatan_id}</div>}
                    </div>
                    <div>
                        <label className={labelStyle}>Jabatan Struktural</label>
                        <select value={data.jabatan_struktural_id || ""} onChange={(e) => setData("jabatan_struktural_id", e.target.value)} className={inputStyle} >
                            <option value="">Tidak Ada Jabatan Struktural</option>
                            {jabatanStrukturalOptions.map((j) => (
                                <option key={j.id} value={j.id}>{j.jabatan_struktural}</option>
                            ))}
                        </select>
                        {errors.jabatan_struktural_id && <div className="text-red-500 text-sm mt-1">{errors.jabatan_struktural_id}</div>}
                    </div>

                    {/* Jenis Pegawai - full width */}
                    <div className="md:col-span-1">
                        <label className={labelStyle}>Jenis Pegawai</label>
                        <select value={data.jenis_pegawai_id} onChange={(e) => setData("jenis_pegawai_id", e.target.value)} className={inputStyle} required >
                            <option value="">Pilih Jenis Pegawai</option>
                            {jenisPegawaiOptions.map((j) => (
                                <option key={j.id} value={j.id}>{j.jenis_pegawai}</option>
                            ))}
                        </select>
                        {errors.jenis_pegawai_id && <div className="text-red-500 text-sm mt-1">{errors.jenis_pegawai_id}</div>}
                    </div>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">Batal</button>
                    <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition" disabled={processing}>
                        {processing ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- KOMPONEN UTAMA KELOLA PEGAWAI ---
export default function KelolaPegawai({
    auth,
    pegawai, // Ini adalah data pegawai dari controller
    jabatanOptions,
    jabatanStrukturalOptions,
    jenisPegawaiOptions,
    flash,
}) {
    const [modalState, setModalState] = useState(null); // 'form' atau 'detail'
    const [selectedPegawai, setSelectedPegawai] = useState(null);
    const { delete: destroy, processing: deleting } = useForm();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8; // Menampilkan 10 data per halaman

    const filteredAndPaginatedPegawai = useMemo(() => {
        const filtered = pegawai.filter((p) =>
            p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.gelar_depan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.gelar_belakang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.jabatan?.nama_jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.jabatan_struktural?.jabatan_struktural.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.jenis_pegawai?.jenis_pegawai.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginated = filtered.slice(startIndex, endIndex);

        return {
            data: paginated,
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
        };
    }, [pegawai, searchQuery, currentPage, ITEMS_PER_PAGE]);

    const { data: paginatedPegawaiData, totalPages } = filteredAndPaginatedPegawai;


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

    const handleOpenModal = (type, data = null) => {
        setSelectedPegawai(data);
        setModalState(type);
    };

    const handleCloseModal = () => {
        setModalState(null);
        setSelectedPegawai(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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

    // Fungsi helper untuk format nama lengkap dengan gelar (digunakan di tabel)
    const formatNamaLengkap = (p) => {
        const gelarDepan = p.gelar_depan ? `${p.gelar_depan} ` : '';
        const gelarBelakang = p.gelar_belakang ? `, ${p.gelar_belakang}` : '';
        return `${gelarDepan}${p.nama}${gelarBelakang}`;
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
                    onClick={() => handleOpenModal("form", null)}
                    className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700"
                >
                    Tambah Pegawai
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow">
                {/* Input Pencarian */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari nama atau NIP"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="bg-purple-100 text-left text-sm font-semibold text-gray-700">
                                <th className="px-4 py-2">NIP</th>
                                <th className="px-4 py-2">Gelar Depan</th>
                                <th className="px-4 py-2">Nama</th>
                                <th className="px-4 py-2">Gelar Belakang</th>
                                <th className="px-4 py-2">Jabatan Struktural</th>
                                <th className="px-4 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPegawaiData.length > 0 ? (
                                paginatedPegawaiData.map((p) => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50 text-gray-700">
                                        <td className="px-4 py-2">{p.nip}</td>
                                        <td className="px-4 py-2">{p.gelar_depan || '-'}</td>
                                        <td className="px-4 py-2">{p.nama}</td>
                                        <td className="px-4 py-2">{p.gelar_belakang || '-'}</td>
                                        {/* Mengakses jabatan_struktural dari objek relasi */}
                                        <td className="px-4 py-2">{p.jabatan_struktural?.jabatan_struktural || '-'}</td>
                                        <td className="px-4 py-2 space-x-2">

                                            <button onClick={() => handleOpenModal("detail", p)} className="p-2 text-sky-600 hover:bg-sky-100 rounded-full" title="Lihat Detail">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                            </button>

                                            <button onClick={() => handleOpenModal("form", p)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-full" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                                            </button>

                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus Pegawai">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        Tidak ada data pegawai ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            {modalState === "form" && (
                <PegawaiFormModal
                    onClose={handleCloseModal}
                    isEdit={!!selectedPegawai}
                    pegawai={selectedPegawai}
                    jabatanOptions={jabatanOptions}
                    jabatanStrukturalOptions={jabatanStrukturalOptions}
                    jenisPegawaiOptions={jenisPegawaiOptions}
                />
            )}
            {modalState === "detail" && selectedPegawai && (
                <DetailPegawaiModal
                    onClose={handleCloseModal}
                    pegawai={selectedPegawai}
                />
            )}
        </AdminLayout>
    );
}
