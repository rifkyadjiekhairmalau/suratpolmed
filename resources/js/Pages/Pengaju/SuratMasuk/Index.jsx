import React, { useMemo, useState, useEffect } from "react";
// Import 'router' dan 'usePage'
import { useForm, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

// =======================================================================
// Komponen UI (DetailModal, Pagination) - Gak ada yang diubah di sini
// =======================================================================
const DetailModal = ({ surat, onClose }) => {
    const getStatusBadgeClass = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("selesai"))
            return "bg-green-100 text-green-800";
        if (
            lowerStatus.includes("dikembalikan") ||
            lowerStatus.includes("ditolak")
        )
            return "bg-red-100 text-red-800";
        if (lowerStatus.includes("didisposisikan"))
            return "bg-blue-100 text-blue-800";
        return "bg-yellow-100 text-yellow-800";
    };
    return (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border-t-4 border-violet-500 bg-white p-8 shadow-2xl">
                <button
                    type="button"
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    Detail Surat : {surat.perihal}
                </h2>
                <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                        Informasi Surat
                    </h3>
                    <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-gray-700 md:grid-cols-2">
                        <p>
                            <strong className="font-medium text-gray-500">
                                No. Agenda:
                            </strong>{" "}
                            {surat.nomor_agenda}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">
                                Ditujukan Kepada:
                            </strong>{" "}
                            {surat.tujuan?.name || "N/A"}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">
                                Tgl. Pengajuan:
                            </strong>{" "}
                            {surat.tanggal_pengajuan}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">
                                Urgensi:
                            </strong>{" "}
                            {surat.urgensi?.nama_urgensi || "N/A"}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">
                                Perihal:
                            </strong>{" "}
                            {surat.perihal}
                        </p>
                        <p>
                            <strong className="col-span-2 font-medium text-gray-500">
                                Status Terkini:
                            </strong>{" "}
                            <span
                                className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(
                                    surat.tracking?.[0]?.status?.nama_status
                                )}`}
                            >
                                {surat.tracking?.[0]?.status?.nama_status ||
                                    "N/A"}
                            </span>
                        </p>
                    </div>
                    <div className="mt-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-800">
                            Isi Surat:
                        </h4>
                        <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                            <p>{surat.keterangan || "Tidak ada keterangan."}</p>
                        </div>
                    </div>
                    {surat.file_path && (
                        <a
                            href={`/storage/${surat.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center text-sm font-medium text-violet-700 hover:underline"
                        >
                            <svg
                                className="mr-2 h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            Lihat File Surat
                        </a>
                    )}
                </div>
                <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                        Riwayat Tracking
                    </h3>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    <th className="px-4 py-2">
                                        Tanggal & Waktu
                                    </th>
                                    <th className="px-4 py-2">Aksi Oleh</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">
                                        Catatan/Instruksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white text-sm">
                                {surat.tracking?.length > 0 ? (
                                    surat.tracking.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.user?.name || "Sistem"}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {item.status?.nama_status ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {item.catatan}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-4 py-3 text-center text-gray-500"
                                        >
                                            Tidak ada riwayat tracking.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
                        onClick={onClose}
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
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="mt-6 flex items-center justify-center space-x-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg px-3 py-1 transition hover:bg-violet-100 disabled:opacity-50"
            >
                &laquo;
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`rounded-lg px-3 py-1 transition ${
                        currentPage === page
                            ? "bg-violet-600 font-bold text-white shadow-md"
                            : "bg-violet-50 text-violet-700 hover:bg-violet-200"
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg px-3 py-1 transition hover:bg-violet-100 disabled:opacity-50"
            >
                &raquo;
            </button>
        </div>
    );
};

// =======================================================================
// KOMPONEN DASHBOARD UTAMA
// =======================================================================
const PengajuDashboard = ({
    auth,
    suratMasuk,
    jenisSurat,
    urgensi,
    tujuan,
    user,
}) => {
    // Ambil props, terutama 'flash' message dari server
    const { props } = usePage();

    // State untuk data dari props
    const [allSurat, setAllSurat] = useState(suratMasuk || []);
    const [safeJenisSurat, setSafeJenisSurat] = useState(jenisSurat || []);
    const [safeUrgensi, setSafeUrgensi] = useState(urgensi || []);
    const [safeTujuan, setSafeTujuan] = useState(tujuan || []);
    const [safeAuth, setSafeAuth] = useState(
        auth || { user: { name: "Pengguna" } }
    );

    // State untuk fungsionalitas UI
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const itemsPerPage = 5;
    const [showForm, setShowForm] = useState(false);

    // Hook useForm
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: null,
        jenis_surat_id: "",
        jenis_surat_manual: "",
        urgensi_surat_id: "",
        tujuan_user_id: "",
        tanggal_pengajuan: new Date().toISOString().slice(0, 10),
        keterangan: "",
        nomor_surat: "",
        perihal: "",
        file_surat: null,
    });

    // "Telinga Ajaib" buat nangkep pesan dari controller
    useEffect(() => {
        // Cek kalo ada pesan 'success'
        if (props.flash && props.flash.success) {
            // PERTAMA: Tutup dulu form-nya
            handleCancelForm();
            // KEDUA: Baru munculin notif cakepnya
            Swal.fire({
                title: "Mantap!",
                text: props.flash.success,
                icon: "success",
                timer: 2500,
                showConfirmButton: false,
            });
        }
        // Cek kalo ada pesan 'error' dari controller (bukan error validasi)
        if (props.flash && props.flash.error) {
            Swal.fire({
                title: "Waduh!",
                text: props.flash.error,
                icon: "error",
            });
        }
    }, [props.flash]); // Telinga ini aktif setiap kali 'props.flash' berubah

    useEffect(() => {
        setAllSurat(suratMasuk || []);
    }, [suratMasuk]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    const handleEditClick = (surat) => {
        setIsEditing(true);
        setData({
            id: surat.id,
            jenis_surat_id:
                surat.jenis_surat_id ||
                (surat.jenis_surat_manual ? "other" : ""),
            jenis_surat_manual: surat.jenis_surat_manual || "",
            urgensi_surat_id: surat.urgensi_surat_id,
            tujuan_user_id: surat.tujuan_user_id,
            tanggal_pengajuan: surat.tanggal_pengajuan,
            keterangan: surat.keterangan || "",
            nomor_surat: surat.nomor_surat || "",
            perihal: surat.perihal || "",
            file_surat: null,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setIsEditing(false);
        reset();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...data };

        // Logika `handleFormSubmit` sekarang jadi simpel banget
        const options = {
            preserveScroll: true,
            // onSuccess dikosongin, karena semua alur sukses dihandle "Telinga Ajaib"
            onError: (errs) => {
                const firstError = Object.values(errs)[0];
                Swal.fire({
                    title: "Oops... Ada yang Salah",
                    text:
                        firstError ||
                        "Gagal mengirim data. Cek lagi isiannya ya.",
                    icon: "error",
                });
            },
        };

        if (isEditing) {
            post(route("pengaju.suratmasuk.update", submissionData.id), {
                ...options,
                data: { ...submissionData, _method: "PUT" },
            });
        } else {
            post(route("pengaju.suratmasuk.store"), submissionData, options);
        }
    };

    const handleAddNewClick = () => {
        handleCancelForm();
        setShowForm(true);
    };

    const paginatedSurat = useMemo(() => {
        if (!allSurat) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allSurat.slice(startIndex, startIndex + itemsPerPage);
    }, [allSurat, currentPage]);

    const totalPages = allSurat ? Math.ceil(allSurat.length / itemsPerPage) : 1;
    const openDetailModal = (surat) => setSelectedSurat(surat);
    const closeDetailModal = () => setSelectedSurat(null);
    const getStatusBadgeClass = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("selesai"))
            return "bg-green-100 text-green-800";
        if (
            lowerStatus.includes("dikembalikan") ||
            lowerStatus.includes("ditolak")
        )
            return "bg-red-100 text-red-800";
        if (lowerStatus.includes("didisposisikan"))
            return "bg-blue-100 text-blue-800";
        return "bg-yellow-100 text-yellow-800";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="block h-8 w-auto"
                                    src="https://via.placeholder.com/32x32?text=ES"
                                    alt="E-Surat Logo"
                                />
                                <span className="ml-2 text-xl font-bold text-gray-800">
                                    e-Surat
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">
                                Selamat datang, {safeAuth.user.name}!
                            </span>
                            <form onSubmit={handleLogout}>
                                <button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-2 0V4H5v12h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H3a1 1 0 01-1-1V3z"
                                            clipRule="evenodd"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M11.707 6.293a1 1 0 010 1.414L9.414 10l2.293 2.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showForm ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
                            <h2 className="mb-2 text-2xl font-bold text-gray-800">
                                {isEditing
                                    ? "Edit Pengajuan Surat"
                                    : "Formulir Pengajuan Surat"}
                            </h2>
                            <p className="mb-6 text-gray-500">
                                {isEditing
                                    ? "Perbarui data surat di bawah ini."
                                    : "Isi data di bawah ini dengan lengkap untuk mengajukan surat baru."}
                            </p>
                            <form onSubmit={handleFormSubmit} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label
                                            htmlFor="jenis_surat_id"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Jenis Surat
                                        </label>
                                        <select
                                            id="jenis_surat_id"
                                            name="jenis_surat_id"
                                            value={data.jenis_surat_id}
                                            onChange={(e) => {
                                                const selectedId =
                                                    e.target.value;
                                                if (selectedId !== "other") {
                                                    setData({
                                                        jenis_surat_id:
                                                            selectedId,
                                                        jenis_surat_manual: "",
                                                    });
                                                } else {
                                                    setData(
                                                        "jenis_surat_id",
                                                        selectedId
                                                    );
                                                }
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Pilih Jenis Surat...
                                            </option>
                                            {safeJenisSurat.map((jenis) => (
                                                <option
                                                    key={jenis.id}
                                                    value={jenis.id}
                                                >
                                                    {jenis.nama_jenis}
                                                </option>
                                            ))}
                                            <option value="other">
                                                Lainnya...
                                            </option>
                                        </select>
                                        {errors.jenis_surat_id && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.jenis_surat_id}
                                            </div>
                                        )}
                                    </div>
                                    {data.jenis_surat_id === "other" && (
                                        <div className="animate-fade-in">
                                            <label
                                                htmlFor="jenis_surat_manual"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Jenis Surat Lainnya
                                            </label>
                                            <input
                                                type="text"
                                                id="jenis_surat_manual"
                                                name="jenis_surat_manual"
                                                value={data.jenis_surat_manual}
                                                onChange={(e) =>
                                                    setData(
                                                        "jenis_surat_manual",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Contoh: Surat Rekomendasi Beasiswa"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                                required
                                            />
                                            {errors.jenis_surat_manual && (
                                                <div className="text-red-600 text-xs mt-1">
                                                    {errors.jenis_surat_manual}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <label
                                            htmlFor="tanggal_pengajuan"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Tanggal Pengajuan
                                        </label>
                                        <input
                                            type="date"
                                            id="tanggal_pengajuan"
                                            name="tanggal_pengajuan"
                                            value={data.tanggal_pengajuan}
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_pengajuan",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        />
                                        {errors.tanggal_pengajuan && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.tanggal_pengajuan}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="nomor_surat"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Nomor Surat (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            id="nomor_surat"
                                            name="nomor_surat"
                                            value={data.nomor_surat}
                                            onChange={(e) =>
                                                setData(
                                                    "nomor_surat",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ketik nomor surat jika ada..."
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                        />
                                        {errors.nomor_surat && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.nomor_surat}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="perihal"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Perihal Surat
                                        </label>
                                        <input
                                            type="text"
                                            id="perihal"
                                            name="perihal"
                                            value={data.perihal}
                                            onChange={(e) =>
                                                setData(
                                                    "perihal",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Permohonan Izin Kunjungan Industri"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        />
                                        {errors.perihal && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.perihal}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="tujuan_user_id"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Ditujukan Kepada
                                        </label>
                                        <select
                                            id="tujuan_user_id"
                                            name="tujuan_user_id"
                                            value={data.tujuan_user_id}
                                            onChange={(e) =>
                                                setData(
                                                    "tujuan_user_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Pilih Tujuan...
                                            </option>
                                            {safeTujuan.map((userTujuan) => (
                                                <option
                                                    key={userTujuan.id}
                                                    value={userTujuan.id}
                                                >
                                                    {userTujuan
                                                        .jabatan_struktural
                                                        ?.jabatan_struktural ||
                                                        userTujuan.name}{" "}
                                                    ({userTujuan.name})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tujuan_user_id && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.tujuan_user_id}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label
                                        htmlFor="keterangan"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Isi Surat
                                    </label>
                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        rows="5"
                                        value={data.keterangan}
                                        onChange={(e) =>
                                            setData(
                                                "keterangan",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Tuliskan isi atau keterangan singkat mengenai surat Anda di sini..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm resize-y"
                                        required
                                    ></textarea>
                                    {errors.keterangan && (
                                        <div className="text-red-600 text-xs mt-1">
                                            {errors.keterangan}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label
                                            htmlFor="file_surat"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Unggah Draft Surat (PDF/Docx)
                                        </label>
                                        {data.file_surat &&
                                            typeof data.file_surat.name !==
                                                "undefined" && (
                                                <div className="text-sm text-gray-500 mb-2">
                                                    File baru dipilih:{" "}
                                                    {data.file_surat.name}
                                                </div>
                                            )}
                                        <input
                                            type="file"
                                            id="file_surat"
                                            name="file_surat"
                                            onChange={(e) =>
                                                setData(
                                                    "file_surat",
                                                    e.target.files[0]
                                                )
                                            }
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                        />
                                        {errors.file_surat && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.file_surat}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="urgensi_surat_id"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Tingkat Urgensi
                                        </label>
                                        <select
                                            id="urgensi_surat_id"
                                            name="urgensi_surat_id"
                                            value={data.urgensi_surat_id}
                                            onChange={(e) =>
                                                setData(
                                                    "urgensi_surat_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">
                                                Pilih Tingkat Urgensi...
                                            </option>
                                            {safeUrgensi.map((levelUrgensi) => (
                                                <option
                                                    key={levelUrgensi.id}
                                                    value={levelUrgensi.id.toString()}
                                                >
                                                    {levelUrgensi.nama_urgensi}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.urgensi_surat_id && (
                                            <div className="text-red-600 text-xs mt-1">
                                                {errors.urgensi_surat_id}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 border-t pt-6 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancelForm}
                                        className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                                        disabled={processing}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? isEditing
                                                ? "Memperbarui..."
                                                : "Mengajukan..."
                                            : isEditing
                                            ? "Perbarui Pengajuan"
                                            : "Submit Pengajuan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        Daftar Pengajuan Surat
                                    </h1>
                                    <p className="mt-1 text-gray-500">
                                        Selamat datang, {safeAuth.user.name}!
                                        Pantau status surat Anda di sini.
                                    </p>
                                </div>
                                <button
                                    onClick={handleAddNewClick}
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md transition-transform transform hover:scale-105"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Ajukan Surat Baru
                                </button>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                    NOMOR AGENDA
                                                </th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                    JENIS SURAT
                                                </th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                    TANGGAL PENGAJUAN
                                                </th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                    STATUS
                                                </th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">
                                                    AKSI
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {paginatedSurat.map((item) => {
                                                const statusTerkini =
                                                    item.tracking?.[0]?.status?.nama_status.toLowerCase() ||
                                                    "";
                                                const isEditable =
                                                    statusTerkini.includes(
                                                        "verifikasi"
                                                    ) ||
                                                    statusTerkini.includes(
                                                        "dikembalikan"
                                                    );

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-gray-800">
                                                            {item.nomor_agenda}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-800">
                                                            {item.jenis_surat
                                                                ?.nama_jenis ||
                                                                item.jenis_surat_manual ||
                                                                "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {
                                                                item.tanggal_pengajuan
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusBadgeClass(
                                                                    item
                                                                        .tracking?.[0]
                                                                        ?.status
                                                                        ?.nama_status
                                                                )}`}
                                                            >
                                                                {item
                                                                    .tracking?.[0]
                                                                    ?.status
                                                                    ?.nama_status ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 flex items-center space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    openDetailModal(
                                                                        item
                                                                    )
                                                                }
                                                                className="text-blue-500 hover:text-blue-700 transition-colors"
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
                                                                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        item
                                                                    )
                                                                }
                                                                disabled={
                                                                    !isEditable
                                                                }
                                                                className={`transition-colors ${
                                                                    isEditable
                                                                        ? "text-green-500 hover:text-green-700"
                                                                        : "text-gray-300 cursor-not-allowed"
                                                                }`}
                                                                title={
                                                                    isEditable
                                                                        ? "Edit Surat"
                                                                        : "Surat tidak dapat diedit lagi"
                                                                }
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
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {paginatedSurat.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="py-10 text-center text-gray-400"
                                                    >
                                                        Tidak ada pengajuan
                                                        surat.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {selectedSurat && (
                <DetailModal surat={selectedSurat} onClose={closeDetailModal} />
            )}
        </div>
    );
};
export default PengajuDashboard;
