import React, { useState, useMemo, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import Swal from "sweetalert2";

// --- 1. KOMPONEN-KOMPONEN MODAL ---

const PegawaiFormModal = ({
    pegawai,
    onClose,
    onSave,
    jabatanOptions,
    jabatanStrukturalOptions,
    jenisPegawaiOptions,
    errors, // Menerima errors dari useForm parent
    processing, // Menerima processing dari useForm parent
}) => {
    // Inisialisasi useForm. Penting: properti ini harus sesuai dengan yang di-validate di Controller
    const initialValues = pegawai
        ? {
              id: pegawai.id,
              nip: pegawai.nip || "",
              gelar_depan: pegawai.gelar_depan || "",
              nama: pegawai.nama || "",
              gelar_belakang: pegawai.gelar_belakang || "",
              tempat_lahir: pegawai.tempat_lahir || "",
              email: pegawai.email || "",
              jabatan_id: pegawai.jabatan_id || "",
              jabatan_struktural_id: pegawai.jabatan_struktural_id || "",
              jenis_pegawai_id: pegawai.jenis_pegawai_id || "",
          }
        : {
              nip: "",
              gelar_depan: "",
              nama: "",
              gelar_belakang: "",
              tempat_lahir: "",
              email: "",
              jabatan_id: jabatanOptions.length > 0 ? jabatanOptions[0].id : "",
              jabatan_struktural_id: "",
              jenis_pegawai_id:
                  jenisPegawaiOptions.length > 0
                      ? jenisPegawaiOptions[0].id
                      : "",
          };

    const { data, setData, reset, clearErrors } = useForm(initialValues);

    useEffect(() => {
        if (pegawai) {
            setData({
                id: pegawai.id,
                nip: pegawai.nip || "",
                gelar_depan: pegawai.gelar_depan || "",
                nama: pegawai.nama || "",
                gelar_belakang: pegawai.gelar_belakang || "",
                tempat_lahir: pegawai.tempat_lahir || "",
                email: pegawai.email || "",
                jabatan_id: pegawai.jabatan_id || "",
                jabatan_struktural_id: pegawai.jabatan_struktural_id || "",
                jenis_pegawai_id: pegawai.jenis_pegawai_id || "",
            });
        } else {
            reset();
        }
        clearErrors();
    }, [
        pegawai,
        jabatanOptions,
        jabatanStrukturalOptions,
        jenisPegawaiOptions,
    ]); // Dependencies yang relevan

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(data, pegawai ? pegawai.id : null); // Kirim data form dan ID ke parent component
    };

    const inputStyle =
        "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400";
    const errorStyle = "text-red-500 text-xs italic mt-1";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {pegawai ? "Edit Pegawai" : "Tambah Pegawai Baru"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            NIP:
                        </label>
                        <input
                            type="text"
                            name="nip"
                            value={data.nip}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />
                        {errors.nip && (
                            <p className={errorStyle}>{errors.nip}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Gelar Depan:
                        </label>
                        <input
                            type="text"
                            name="gelar_depan"
                            value={data.gelar_depan}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        {errors.gelar_depan && (
                            <p className={errorStyle}>{errors.gelar_depan}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Nama Lengkap:
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={data.nama}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />
                        {errors.nama && (
                            <p className={errorStyle}>{errors.nama}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Gelar Belakang:
                        </label>
                        <input
                            type="text"
                            name="gelar_belakang"
                            value={data.gelar_belakang}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        {errors.gelar_belakang && (
                            <p className={errorStyle}>
                                {errors.gelar_belakang}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />
                        {errors.email && (
                            <p className={errorStyle}>{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Tempat Lahir:
                        </label>
                        <input
                            type="text"
                            name="tempat_lahir"
                            value={data.tempat_lahir}
                            onChange={handleChange}
                            className={inputStyle}
                            required
                        />
                        {errors.tempat_lahir && (
                            <p className={errorStyle}>{errors.tempat_lahir}</p>
                        )}
                    </div>
                    {/* Hapus input Tanggal Lahir (pastikan ini tidak ada) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Jabatan Fungsional:
                        </label>
                        <select
                            name="jabatan_id"
                            value={data.jabatan_id}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            {/* Tambahkan opsi default "Pilih Jabatan" jika diperlukan */}
                            {/* Jika jabatan_id bisa null di DB, tambahkan <option value="">Pilih...</option> */}
                            {jabatanOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.nama_jabatan}
                                </option>
                            ))}
                        </select>
                        {errors.jabatan_id && (
                            <p className={errorStyle}>{errors.jabatan_id}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                            Jabatan Struktural:
                        </label>
                        <select
                            name="jabatan_struktural_id"
                            value={data.jabatan_struktural_id}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            <option value="">
                                Tidak Ada Jabatan Struktural
                            </option>{" "}
                            {/* Opsi untuk null */}
                            {jabatanStrukturalOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.jabatan_struktural}
                                </option>
                            ))}
                        </select>
                        {errors.jabatan_struktural_id && (
                            <p className={errorStyle}>
                                {errors.jabatan_struktural_id}
                            </p>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jenis Pegawai:
                        </label>
                        <select
                            name="jenis_pegawai_id"
                            value={data.jenis_pegawai_id}
                            onChange={handleChange}
                            className={inputStyle}
                        >
                            {/* Jika jenis_pegawai_id bisa null di DB, tambahkan <option value="">Pilih...</option> */}
                            {jenisPegawaiOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.jenis_pegawai}
                                </option>
                            ))}
                        </select>
                        {errors.jenis_pegawai_id && (
                            <p className={errorStyle}>
                                {errors.jenis_pegawai_id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-lg"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold"
                        disabled={processing}
                    >
                        {processing
                            ? "Menyimpan..."
                            : pegawai
                            ? "Perbarui"
                            : "Simpan"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const DeleteConfirmModal = ({ pegawai, onClose, onConfirm, processing }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Konfirmasi Hapus
            </h2>
            <p className="text-gray-600">
                Anda yakin ingin menghapus data pegawai{" "}
                <strong className="font-semibold">{pegawai.nama}</strong>?
            </p>
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={onClose}
                    className="px-6 py-2 border rounded-lg"
                >
                    Batal
                </button>
                <button
                    onClick={() => onConfirm(pegawai.id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold"
                    disabled={processing}
                >
                    {processing ? "Menghapus..." : "Ya, Hapus"}
                </button>
            </div>
        </div>
    </div>
);

const DetailPegawaiModal = ({ pegawai, onClose }) => {
    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value || "-"}</p>
        </div>
    );
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semi-bold text-gray-800 mb-6">
                    Detail Pegawai
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailItem
                        label="Nama Lengkap"
                        value={`${pegawai.gelar_depan || ""} ${pegawai.nama} ${
                            pegawai.gelar_belakang || ""
                        }`.trim()}
                    />
                    <DetailItem label="NIP" value={pegawai.nip} />
                    <DetailItem label="Email" value={pegawai.email} />
                    <DetailItem
                        label="Kelahiran"
                        value={`${pegawai.tempat_lahir}`}
                    />{" "}
                    {/* Hanya tempat lahir */}
                    {/* Baris Tanggal Lahir Dihilangkan */}
                    <DetailItem
                        label="Jabatan Fungsional"
                        value={pegawai.jabatan || "-"}
                    />
                    <DetailItem
                        label="Jabatan Struktural"
                        value={pegawai.jabatan_struktural || "-"}
                    />
                    <DetailItem
                        label="Jenis Pegawai"
                        value={pegawai.jenis_pegawai || "-"}
                    />
                </div>
                <div className="flex justify-end mt-8 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
        const pages = [];
        const maxShownPages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxShownPages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxShownPages - 1);

        if (endPage - startPage + 1 < maxShownPages) {
            startPage = Math.max(1, endPage - maxShownPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <nav
            className="flex items-center justify-center gap-4 mt-6"
            aria-label="Pagination"
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                &laquo; Prev
            </button>
            <div className="flex items-center gap-2">
                {generatePageNumbers().map((num) => (
                    <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                            currentPage === num
                                ? "bg-violet-600 text-white shadow-lg"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                        aria-current={currentPage === num ? "page" : undefined}
                    >
                        {num}
                    </button>
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

// --- 3. KOMPONEN HALAMAN UTAMA ---

export default function KelolaPegawai({
    auth,
    pegawai,
    jabatanOptions,
    jabatanStrukturalOptions,
    jenisPegawaiOptions,
    flash,
}) {
    const [pegawaiList, setPegawaiList] = useState(pegawai);
    const [modalState, setModalState] = useState(null);
    const [selectedPegawai, setSelectedPegawai] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 7;

    const { processing, errors, post, put, delete: destroy } = useForm();

    useEffect(() => {
        setPegawaiList(pegawai);
    }, [pegawai]);

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
                showConfirmButton: false,
                timer: 2000,
            });
        }
        if (flash.error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: flash.error,
            });
        }
    }, [flash]);

    const filteredPegawai = useMemo(() => {
        return pegawaiList.filter(
            (p) =>
                p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.nip.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pegawaiList, searchQuery]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredPegawai.length / ITEMS_PER_PAGE);
        const paginatedData = filteredPegawai.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
        return { paginatedData, totalPages };
    }, [filteredPegawai, currentPage]);

    const handleOpenModal = (type, pegawai = null) => {
        setSelectedPegawai(pegawai);
        setModalState(type);
    };

    const handleCloseModal = () => {
        setModalState(null);
        setSelectedPegawai(null);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSave = (formData, id = null) => {
        console.log("🚀 Form data yang akan dikirim:", formData);
        console.log("🆔 ID yang dikirim:", id);

        if (id) {
            put(route("admin.pegawai.update", id), formData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (validationErrors) => {
                    console.error("❌ Validation Errors:", validationErrors);
                },
            });
        } else {
            post(route("admin.pegawai.store"), formData, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (validationErrors) => {
                    console.error("❌ Validation Errors:", validationErrors);
                },
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Yakin ingin menghapus data ini?",
            text: "Anda tidak akan bisa mengembalikan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("admin.pegawai.destroy", id), {
                    onSuccess: () => {
                        // Success message handled by flash in useEffect
                    },
                    onError: (errors) => {
                        Swal.fire(
                            "Gagal!",
                            "Terjadi kesalahan saat menghapus data.",
                            "error"
                        );
                        console.error("Error deleting pegawai:", errors);
                    },
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
                    onClick={() => handleOpenModal("add")}
                    className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition"
                >
                    Tambah Pegawai
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <input
                    type="text"
                    placeholder="Cari Nama atau NIP..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full md:w-1/3 mb-4 border-gray-300 rounded-lg focus:ring-violet-400"
                />
                <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                    NIP
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                    Gelar Depan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                    Nama Lengkap
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                    Gelar Belakang
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                    Jabatan Struktural
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-black-600 uppercase">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((pegawai) => (
                                    <tr
                                        key={pegawai.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-gray-800">
                                            {pegawai.nip}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {pegawai.gelar_depan || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">
                                            {pegawai.nama}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {pegawai.gelar_belakang || "-"}
                                        </td>
                                        {/* Mengakses nama jabatan struktural dari relasi (sudah di-map) */}
                                        <td className="px-6 py-4 text-gray-800">
                                            {pegawai.jabatan_struktural || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            "detail",
                                                            pegawai
                                                        )
                                                    }
                                                    className="p-2 text-sky-600 hover:bg-sky-100 rounded-full"
                                                    title="Lihat Detail"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            "edit",
                                                            pegawai
                                                        )
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
                                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(pegawai.id)
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
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-10 text-gray-500"
                                    >
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

            {/* Render Modals */}
            {modalState === "add" && (
                <PegawaiFormModal
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    pegawai={null}
                    jabatanOptions={jabatanOptions}
                    // Hapus 'K' yang tidak diperlukan di sini
                    jabatanStrukturalOptions={jabatanStrukturalOptions}
                    jenisPegawaiOptions={jenisPegawaiOptions}
                    errors={errors}
                    processing={processing}
                />
            )}
            {modalState === "edit" && selectedPegawai && (
                <PegawaiFormModal
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    pegawai={selectedPegawai}
                    jabatanOptions={jabatanOptions}
                    jabatanStrukturalOptions={jabatanStrukturalOptions}
                    jenisPegawaiOptions={jenisPegawaiOptions}
                    errors={errors}
                    processing={processing}
                />
            )}
            {modalState === "delete" && selectedPegawai && (
                <DeleteConfirmModal
                    onClose={handleCloseModal}
                    onConfirm={handleDelete}
                    pegawai={selectedPegawai}
                    processing={processing}
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
