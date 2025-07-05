import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import BagianUmumLayout from '@/layouts/BagianUmumLayout';
import { FaRegEdit, FaRegTrashAlt, FaEye, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import 'dayjs/locale/id';
dayjs.locale('id');

// Daftar status untuk dropdown filter (tetap sama)
const STATUS_OPTIONS = ['Semua Status', 'Draft', 'Terkirim', 'Dibatalkan'];

// --- Component: AddModal (Tidak ada perubahan) ---
function AddModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nomor_surat: '',
        perihal_surat: '',
        tanggal_keluar: '',
        tujuan: '',
        keterangan_tambahan: '',
        file_surat: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('administrasi_umum.suratkeluar.store'), {
            onSuccess: () => {
                Swal.fire('Berhasil!', 'Surat Keluar berhasil ditambahkan.', 'success');
                reset();
                onClose();
                router.reload({ only: ['suratKeluar'], preserveScroll: true });
            },
            onError: (formErrors) => {
                console.error("Tambah Surat Error:", formErrors);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan surat.', 'error');
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative border-2 border-purple-200">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tambah Surat Keluar Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    {/* Form fields... (tidak ada perubahan di sini) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Surat <span className="text-red-500">*</span></label>
                        <input type="text" name="nomor_surat" value={data.nomor_surat} onChange={(e) => setData('nomor_surat', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400" required />
                        {errors.nomor_surat && <div className="text-red-500 text-xs mt-1">{errors.nomor_surat}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Keluar <span className="text-red-500">*</span></label>
                        <input type="date" name="tanggal_keluar" value={data.tanggal_keluar} onChange={(e) => setData('tanggal_keluar', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400" required />
                        {errors.tanggal_keluar && <div className="text-red-500 text-xs mt-1">{errors.tanggal_keluar}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan <span className="text-red-500">*</span></label>
                        <input type="text" name="tujuan" value={data.tujuan} onChange={(e) => setData('tujuan', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400" required />
                        {errors.tujuan && <div className="text-red-500 text-xs mt-1">{errors.tujuan}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perihal <span className="text-red-500">*</span></label>
                        <input type="text" name="perihal_surat" value={data.perihal_surat} onChange={(e) => setData('perihal_surat', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400" required />
                        {errors.perihal_surat && <div className="text-red-500 text-xs mt-1">{errors.perihal_surat}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                        <textarea name="keterangan_tambahan" value={data.keterangan_tambahan} onChange={(e) => setData('keterangan_tambahan', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm" rows="3"></textarea>
                        {errors.keterangan_tambahan && <div className="text-red-500 text-xs mt-1">{errors.keterangan_tambahan}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Surat <span className="text-red-500">*</span></label>
                        <input type="file" name="file_surat" onChange={(e) => setData('file_surat', e.target.files[0])} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" required />
                        {errors.file_surat && <div className="text-red-500 text-xs mt-1">{errors.file_surat}</div>}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-8 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition duration-200 shadow-sm text-sm" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- PERUBAHAN DIMULAI DI SINI ---
// --- Component: DetailModal (Modal untuk menampilkan SEMUA DETAIL SURAT) ---
function DetailModal({ surat, onClose }) { // Menerima object 'surat'
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative border-2 border-purple-200">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Surat Keluar</h2>

                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">No. Agenda</p>
                        <p className="col-span-2 text-gray-800">{surat.nomor_agenda}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">Nomor Surat</p>
                        <p className="col-span-2 text-gray-800">{surat.nomor_surat}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">Tanggal Keluar</p>
                        <p className="col-span-2 text-gray-800">{dayjs(surat.tanggal_keluar).format("DD MMMM YYYY")}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">Pengirim</p>
                        <p className="col-span-2 text-gray-800">{surat.pengirim}</p>
                    </div>
                     <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">Tujuan</p>
                        <p className="col-span-2 text-gray-800">{surat.tujuan}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">Perihal</p>
                        <p className="col-span-2 text-gray-800">{surat.perihal_surat}</p>
                    </div>
                     <div className="grid grid-cols-3 gap-4 border-b pb-2">
                        <p className="font-semibold text-gray-500">File Surat</p>
                        <div className="col-span-2">
                             {surat.file_url ? (
                                <a href={surat.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                                    Lihat File
                                </a>
                            ) : (
                                <p className="text-gray-500">Tidak ada file</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <p className="font-semibold text-gray-500">Keterangan</p>
                        <p className="col-span-2 text-gray-700 bg-gray-50 p-3 rounded-md border">{surat.keterangan_tambahan || "Tidak ada keterangan tambahan."}</p>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-200 text-sm"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Component: EditModal (Tidak ada perubahan) ---
function EditModal({ surat, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: surat.id,
        nomor_surat: surat.nomor_surat || '',
        perihal_surat: surat.perihal_surat || '',
        tanggal_keluar: surat.tanggal_keluar || '',
        tujuan: surat.tujuan || '',
        keterangan_tambahan: surat.keterangan_tambahan || '',
        file_surat: null,
        _method: 'put',
    });

    useEffect(() => {
        setData({
            id: surat.id,
            nomor_surat: surat.nomor_surat || '',
            perihal_surat: surat.perihal_surat || '',
            tanggal_keluar: surat.tanggal_keluar || '',
            tujuan: surat.tujuan || '',
            keterangan_tambahan: surat.keterangan_tambahan || '',
            file_surat: null,
            _method: 'put',
        });
    }, [surat]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('administrasi_umum.suratkeluar.update', { suratKeluar: data.id }), {
            onSuccess: () => {
                Swal.fire('Berhasil!', 'Surat Keluar berhasil diperbarui.', 'success');
                onClose();
                router.reload({ only: ['suratKeluar'], preserveScroll: true });
            },
            onError: (formErrors) => {
                console.error("Edit Error:", formErrors);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui surat.', 'error');
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative border-2 border-purple-200">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Surat Keluar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields... (tidak ada perubahan di sini) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Surat</label>
                        <input type="text" name="nomor_surat" value={data.nomor_surat} onChange={(e) => setData('nomor_surat', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm" required disabled />
                        {errors.nomor_surat && <div className="text-red-500 text-xs mt-1">{errors.nomor_surat}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Keluar</label>
                        <input type="date" name="tanggal_keluar" value={data.tanggal_keluar} onChange={(e) => setData('tanggal_keluar', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm" required />
                        {errors.tanggal_keluar && <div className="text-red-500 text-xs mt-1">{errors.tanggal_keluar}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
                        <input type="text" name="tujuan" value={data.tujuan} onChange={(e) => setData('tujuan', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm" required />
                        {errors.tujuan && <div className="text-red-500 text-xs mt-1">{errors.tujuan}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perihal</label>
                        <input type="text" name="perihal_surat" value={data.perihal_surat} onChange={(e) => setData('perihal_surat', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm" required />
                        {errors.perihal_surat && <div className="text-red-500 text-xs mt-1">{errors.perihal_surat}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                        <textarea name="keterangan_tambahan" value={data.keterangan_tambahan} onChange={(e) => setData('keterangan_tambahan', e.target.value)} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm" rows="3"></textarea>
                        {errors.keterangan_tambahan && <div className="text-red-500 text-xs mt-1">{errors.keterangan_tambahan}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Surat (Opsional)</label>
                        <input type="file" name="file_surat" onChange={(e) => setData('file_surat', e.target.files[0])} className="w-full px-4 py-2 border border-purple-300 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        {errors.file_surat && <div className="text-red-500 text-xs mt-1">{errors.file_surat}</div>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" className="px-6 py-2 border border-red-300 rounded-lg text-red-700 font-semibold hover:bg-red-50 transition" onClick={onClose} disabled={processing}>Batal</button>
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- Komponen Utama Surat Keluar ---
export default function SuratKeluar({ auth, suratKeluar: initialSuratKeluar }) {
    const { flash } = usePage().props;

    const [suratKeluarList, setSuratKeluarList] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editSurat, setEditSurat] = useState(null);

    // --- PERUBAHAN ---
    const [detailSurat, setDetailSurat] = useState(null); // Ganti dari detailKeterangan menjadi detailSurat (object)

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const transformSuratData = (surat) => ({
        id: surat.id,
        nomor_agenda: surat.nomor_agenda || 'N/A',
        nomor_surat: surat.nomor_surat || 'N/A',
        tanggal_keluar: surat.tanggal_keluar || 'N/A',
        pengirim: surat.pengirim?.name || 'N/A',
        tujuan: surat.tujuan || 'N/A',
        perihal_surat: surat.perihal_surat || 'N/A',
        keterangan_tambahan: surat.keterangan_tambahan || 'Tidak ada',
        file_url: surat.file_surat ? `/storage/${surat.file_surat}` : null,
        status: 'Terkirim',
    });

    useEffect(() => {
        if (initialSuratKeluar) {
            setSuratKeluarList(initialSuratKeluar.map(transformSuratData));
        }
    }, [initialSuratKeluar]);

    useEffect(() => {
        if (flash && flash.success) {
            Swal.fire({ icon: "success", title: "Berhasil!", text: flash.success, timer: 3000, showConfirmButton: false });
        }
        if (flash && flash.error) {
            Swal.fire({ icon: "error", title: "Terjadi Kesalahan!", text: flash.error });
        }
    }, [flash]);

    const filteredSurat = useMemo(() => {
        return suratKeluarList
            .filter(surat =>
                (surat.nomor_surat || '').toLowerCase().includes(search.toLowerCase()) ||
                (surat.perihal_surat || '').toLowerCase().includes(search.toLowerCase())
            )
            .filter(surat => statusFilter === 'Semua Status' || surat.status === statusFilter);
    }, [suratKeluarList, search, statusFilter]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredSurat.length / ITEMS_PER_PAGE);
        const paginatedData = filteredSurat.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
        return { paginatedData, totalPages };
    }, [filteredSurat, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDelete = (suratId) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('administrasi_umum.suratkeluar.destroy', { suratKeluar: suratId }), {
                    onSuccess: () => {
                        Swal.fire('Dihapus!', 'Surat Keluar telah dihapus.', 'success');
                        router.reload({ only: ['suratKeluar'], preserveScroll: true });
                    },
                    onError: (errors) => {
                        console.error("Hapus Error:", errors);
                        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus surat.', 'error');
                    },
                });
            }
        });
    };

    const openAddModal = () => setShowAddModal(true);
    const closeAddModal = () => setShowAddModal(false);

    // --- PERUBAHAN ---
    // Fungsi untuk membuka modal detail, menerima object surat
    const openDetailModal = (surat) => {
        setDetailSurat(surat);
    };

    // Fungsi untuk menutup modal detail
    const closeDetailModal = () => {
        setDetailSurat(null);
    };

    return (
        <BagianUmumLayout user={auth.user}>
            <Head title="Surat Keluar" />
            <main className="min-h-screen bg-gray-50 p-2 md:p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-black mb-1 drop-shadow">Surat Keluar</h1>
                            <p className="text-gray-600">Daftar seluruh surat keluar yang telah diproses.</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="px-6 py-2 bg-violet-600 to-purple-500 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-600 transition duration-200 shadow-md flex items-center justify-center ml-auto"
                        >Tambah Surat Keluar
                        </button>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-purple-200">
                        <div className="w-1/2 mb-4 flex flex-col md:flex-row items-center gap-4">
                            <input
                                type="text"
                                placeholder="Cari No. Surat atau Perihal"
                                value={search}
                                onChange={e => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-purple-200">
                                <thead className="bg-purple-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">No. Agenda</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">No. Surat</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">Tanggal Keluar</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">Pengirim</th> */}
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">Tujuan</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">Perihal</th> */}
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-700 uppercase">File</th>
                                        <th className="px-9 py-3 text-left text-xs font-bold text-black-700 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-purple-100 text-sm">
                                    {paginatedData.length > 0 ? paginatedData.map((surat) => (
                                        <tr key={surat.id}>
                                            <td className="px-4 py-3">{surat.nomor_agenda}</td>
                                            <td className="px-4 py-3">{surat.nomor_surat}</td>
                                            <td className="px-4 py-3">{dayjs(surat.tanggal_keluar).format("DD MMMM YYYY")}</td>
                                            {/* <td className="px-4 py-3">{surat.pengirim}</td> */}
                                            <td className="px-4 py-3">{surat.tujuan}</td>
                                            {/* <td className="px-4 py-3">{surat.perihal_surat}</td> */}
                                            <td className="px-4 py-3">
                                                {surat.file_url ? (
                                                    <a href={surat.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a>
                                                ) : ('Tidak Ada')}
                                            </td>
                                            <td className="px-1 py-2">
                                                {/* --- PERUBAHAN --- */}
                                                <button
                                                    className="p-2 text-sky-600 hover:bg-sky-100 rounded-full"
                                                    title="Lihat Detail"
                                                    onClick={() => openDetailModal(surat)} // Mengirim seluruh objek surat
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                                </button>
                                                <button
                                                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-full"
                                                    title="Edit"
                                                    onClick={() => setEditSurat(surat)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                                    title="Hapus"
                                                    onClick={() => handleDelete(surat.id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-8 text-purple-400">List Surat Kosong</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination (Tidak ada perubahan) */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8">
                                {/* Pagination code... */}
                            </div>
                        )}
                    </div>

                    {/* Render Modals */}
                    {showAddModal && <AddModal onClose={closeAddModal} />}
                    {editSurat && <EditModal surat={editSurat} onClose={() => setEditSurat(null)} />}

                    {/* --- PERUBAHAN --- */}
                    {/* Render DetailModal jika detailSurat tidak null */}
                    {detailSurat && <DetailModal surat={detailSurat} onClose={closeDetailModal} />}
                </div>
            </main>
        </BagianUmumLayout>
    );
}
