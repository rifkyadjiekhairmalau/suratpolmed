import React, { useMemo, useState, useEffect, useRef } from "react";
import { useForm, router, usePage, Head } from "@inertiajs/react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    MailOutlined,
} from "@ant-design/icons";

dayjs.locale("id");


// =======================================================================
// HELPER COMPONENTS (DetailModal & Pagination)
// =======================================================================

const DetailModal = ({ surat, onClose }) => {
    const getStatusBadgeClass = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("selesai")) return "bg-green-100 text-green-800";
        if (lowerStatus.includes("dikembalikan") || lowerStatus.includes("ditolak")) return "bg-red-100 text-red-800";
        if (lowerStatus.includes("disposisi")|| lowerStatus.includes("tindak lanjut")) return "bg-blue-100 text-blue-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const TrackingItem = ({ item, isLast }) => {
        const getIcon = (status) => {
            const lowerStatus = status?.toLowerCase() || "";
            if (lowerStatus.includes("selesai")) return <CheckCircleOutlined className="text-green-500" />;
            if (lowerStatus.includes("dikembalikan") || lowerStatus.includes("ditolak")) return <CloseCircleOutlined className="text-red-500" />;
            if (lowerStatus.includes("disposisi") || lowerStatus.includes("tindak lanjut") || lowerStatus.includes("proses")) return <ArrowRightOutlined className="text-blue-500" />;
            if (lowerStatus.includes("verifikasi")) return <ClockCircleOutlined className="text-yellow-500" />;
            return <MailOutlined className="text-gray-500" />;
        };

        return (
            <div className="relative flex pb-8">
                {!isLast && <div className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"></div>}
                <div className="relative flex h-10 w-10 flex-none items-center justify-center bg-white">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg ring-8 ring-white">
                        {getIcon(item.status?.nama_status)}
                    </div>
                </div>
                <div className="flex-grow pl-4">
                    <p className="text-sm font-medium text-gray-800">{item.status?.nama_status}</p>
                    <p className="text-sm text-gray-500">{dayjs(item.created_at).format("DD MMM YYYY, HH:mm")}</p>
                    <p className="mt-1 text-xs text-gray-500">
                        {item.dariUser && item.keUser ? `Dari ${item.dariUser.name} ke ${item.keUser.name}` : `Oleh: ${item.user?.name || "Sistem"}`}
                    </p>
                    {item.catatan && <p className="mt-2 text-xs italic bg-yellow-100 border border-yellow-200 text-yellow-800 p-2 rounded-md">"{item.catatan}"</p>}
                </div>
            </div>
        );
    };

    const DetailItem = ({ label, children }) => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2.5 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="sm:col-span-2 text-sm text-gray-800">{children}</dd>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-gray-200">
                <header className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
                    <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
                    <h2 className="text-2xl font-bold text-gray-800">Detail Surat: {surat.perihal}</h2>
                </header>
                <div className="overflow-y-auto p-6 space-y-8">
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Informasi Surat</h3>
                        <dl>
                            <DetailItem label="No. Agenda">{surat.nomor_agenda || "-"}</DetailItem>
                            <DetailItem label="Tujuan">{surat.tujuan?.name || "N/A"}</DetailItem>
                            <DetailItem label="Tgl Pengajuan">{dayjs(surat.tanggal_pengajuan).format("DD MMMM YYYY")}</DetailItem>
                            <DetailItem label="Urgensi"><span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">{surat.urgensi?.nama_urgensi || "N/A"}</span></DetailItem>
                            <DetailItem label="Status Terkini">
                                <span className={`px-2 py-1 text-xs font-medium rounded-md inline-block ${getStatusBadgeClass(surat.tracking?.[0]?.status?.nama_status)}`}>
                                    {surat.tracking?.[0]?.status?.nama_status || "N/A"}
                                </span>
                            </DetailItem>
                            <DetailItem label="File Surat">
                                {surat.file_path ? (
                                    <a href={`/storage/${surat.file_path}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">
                                        <FileTextOutlined className="mr-2" /> Lihat File
                                    </a>
                                ) : <span className="italic text-gray-500">Tidak ada file</span>}
                            </DetailItem>
                        </dl>
                        <div className="mt-5">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Isi Surat / Keterangan</h4>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 max-h-32 text-sm overflow-y-auto whitespace-pre-wrap">
                                {surat.keterangan || "Tidak ada isi atau keterangan tambahan."}
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Riwayat Tracking</h3>
                        <div className="flow-root">
                             {(surat.tracking || []).length > 0 ? (
                                (surat.tracking || []).map((item, index) => (
                                    <TrackingItem key={item.id} item={item} isLast={index === surat.tracking.length - 1} />
                                ))
                             ) : (
                                <p className="text-sm text-gray-500 italic">Belum ada riwayat tracking.</p>
                             )}
                        </div>
                    </section>
                </div>
                <footer className="p-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white rounded-b-2xl z-10">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold transition">Tutup</button>
                </footer>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                « Prev
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105
                        ${currentPage === number
                            ? 'bg-violet-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:text-violet-600'
                        }`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                Next »
            </button>
        </div>
    );
};


// =======================================================================
// KOMPONEN DASHBOARD UTAMA
// =======================================================================
const PengajuDashboard = ({ auth, suratMasuk, jenisSurat, urgensi, tujuan, user }) => {
    // ... (Seluruh state dan fungsi dari kode asli Anda tetap sama persis)
    const [allSurat, setAllSurat] = useState(suratMasuk || []);
    const [safeJenisSurat] = useState(jenisSurat || []);
    const [safeUrgensi] = useState(urgensi || []);
    const [safeTujuan] = useState(tujuan || []);
    const [safeAuth] = useState(auth || { user: { name: "Pengguna" } });
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const itemsPerPage = 6;
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState("Semua Status");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        id: null, nomor_agenda: "", jenis_surat_id: "", jenis_surat_manual: "", urgensi_surat_id: "", tujuan_user_id: "", tanggal_pengajuan: new Date().toISOString().slice(0, 10), keterangan: "", nomor_surat: "", perihal: "", file_surat: null,
    });

    useEffect(() => { setAllSurat(suratMasuk || []); }, [suratMasuk]);
    const { flash } = usePage().props;
    useEffect(() => {
        if (flash?.success) { Swal.fire({ title: "Berhasil!", text: flash.success, icon: "success", timer: 3000, showConfirmButton: false }); }
        if (flash?.error) { Swal.fire({ title: "Error!", text: flash.error, icon: "error" }); }
    }, [flash]);
    useEffect(() => {
        const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setDropdownOpen(false); } };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef]);
    const handleLogout = (e) => { e.preventDefault(); router.post(route("logout")); };
    const handleEditClick = (surat) => {
        setIsEditing(true);
        setData({ id: surat.id, nomor_agenda: surat.nomor_agenda || "", jenis_surat_id: surat.jenis_surat_id || "", jenis_surat_manual: surat.jenis_surat_manual || "", urgensi_surat_id: surat.urgensi_surat_id, tujuan_user_id: surat.tujuan_user_id, tanggal_pengajuan: surat.tanggal_pengajuan, keterangan: surat.keterangan || "", nomor_surat: surat.nomor_surat || "", perihal: surat.perihal || "", file_surat: null });
        setShowForm(true);
    };
    const handleCancelForm = () => { setShowForm(false); reset(); setIsEditing(false); };
    const handleAddNewClick = () => {
        setIsEditing(false);
        reset();
        const currentYear = new Date().getFullYear();
        const countThisYear = allSurat.filter(surat => new Date(surat.created_at).getFullYear() === currentYear).length;
        const nextNumber = countThisYear + 1;
        const paddedNumber = String(nextNumber).padStart(3, '0');
        const newNomorAgenda = `${paddedNumber}-${currentYear}`;
        setData({
        id: null,
        nomor_agenda: newNomorAgenda,
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
        setShowForm(true);
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!data.jenis_surat_id || !data.urgensi_surat_id || !data.tujuan_user_id || !data.tanggal_pengajuan || !data.perihal) {
            Swal.fire({ icon: 'warning', title: 'Input Tidak Lengkap', text: 'Pastikan semua field wajib diisi!' });
            return;
        }
        if (data.jenis_surat_id === "other" && !data.jenis_surat_manual) {
            Swal.fire({ icon: 'warning', title: 'Jenis Surat Lainnya Kosong', text: 'Mohon isi jenis surat lainnya!' });
            return;
        }
        const options = {
            forceFormData: true, preserveScroll: true,
            onSuccess: () => {
                handleCancelForm();
                Swal.fire({ title: "Mantap!", text: `Surat berhasil ${isEditing ? "diperbarui" : "diajukan"}.`, icon: "success", timer: 2000, showConfirmButton: false });
                router.reload({ only: ['suratMasuk'], preserveScroll: true });
            },
            onError: (errs) => {
                console.error("Submission Errors:", errs);
                let errorMessage = "Gagal mengirim data. Cek lagi isiannya ya.";
                if (Object.keys(errs).length > 0) { errorMessage = Object.values(errs)[0]; }
                Swal.fire({ title: "Oops... Ada yang Salah", text: errorMessage, icon: "error" });
            },
        };
        if (isEditing) {
            router.post(route("pengaju.suratmasuk.update", data.id), { _method: "put", ...data }, options);
        } else {
            post(route("pengaju.suratmasuk.store"), options);
        }
    };
    const filteredAndSearchedSurat = useMemo(() => {
        let filtered = allSurat;
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter((surat) => surat.perihal.toLowerCase().includes(lowerCaseQuery) || (surat.jenis_surat?.nama_jenis && surat.jenis_surat.nama_jenis.toLowerCase().includes(lowerCaseQuery)) || (surat.jenis_surat_manual && surat.jenis_surat_manual.toLowerCase().includes(lowerCaseQuery)));
        }
        if (filterStatus && filterStatus !== "Semua Status") {
            filtered = filtered.filter((surat) => { const latestStatus = surat.tracking?.[0]?.status?.nama_status; return latestStatus && latestStatus.toLowerCase() === filterStatus.toLowerCase(); });
        }
        return filtered;
    }, [allSurat, searchQuery, filterStatus]);
    const paginatedSurat = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSearchedSurat.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSearchedSurat, currentPage, itemsPerPage]);
    const totalPages = Math.ceil(filteredAndSearchedSurat.length / itemsPerPage);
    const openDetailModal = (surat) => setSelectedSurat(surat);
    const closeDetailModal = () => setSelectedSurat(null);
    const allUniqueStatuses = useMemo(() => {
        const statuses = new Set();
        (suratMasuk || []).forEach(surat => { if (surat.tracking?.[0]?.status?.nama_status) { statuses.add(surat.tracking[0].status.nama_status); } });
        return ["Semua Status", ...Array.from(statuses).sort()];
    }, [suratMasuk]);
    const getStatusBadgeClass = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("selesai")) return "bg-green-100 text-green-800";
        if (lowerStatus.includes("dikembalikan") || lowerStatus.includes("ditolak")) return "bg-red-100 text-red-800";
        if (lowerStatus.includes("disposisi")|| lowerStatus.includes("tindak lanjut")) return "bg-blue-100 text-blue-800";
        return "bg-yellow-100 text-yellow-800";
    };

    return (
        <div className="min-h-screen bg-gray-100">
             <Head title="Dashboard Pengaju" />
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <img className="block h-8 w-auto" src="https://polmed.ac.id/wp-content/uploads/2014/04/logo-polmed-png.png" alt="E-Surat Logo" />
                                <span className="ml-2 text-xl font-bold text-gray-800">Sistem Informasi Persuratan</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500" aria-haspopup="true" aria-expanded={isDropdownOpen}>
                                    <span className="sr-only">Buka menu user</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20" role="menu" aria-orientation="vertical">
                                        <div className="py-1" role="none">
                                            <div className="px-6 py-4">
                                                <p className="text-sm text-gray-600">Masuk sebagai</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">{safeAuth.user.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleLogout}>
                                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" /></svg>
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="pt-6 pb-12">
                    {showForm ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Pengajuan Surat" : "Form Pengajuan Surat Baru"}</h2>
                                <button onClick={handleCancelForm} className="text-gray-500 hover:text-gray-700 text-2xl" title="Tutup Form">&times;</button>
                            </div>
                            <p className="mb-3 text-gray-500">{isEditing ? "Perbarui data surat di bawah ini." : "Isi data di bawah ini dengan lengkap untuk mengajukan surat baru."}</p>
                            <form onSubmit={handleFormSubmit} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                                    <div>
                                        <label htmlFor="nomor_agenda" className="block text-sm font-medium text-gray-700 mb-1">No. Agenda</label>
                                        <input type="text" id="nomor_agenda" name="nomor_agenda" value={data.nomor_agenda} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm cursor-not-allowed" readOnly />
                                        {errors.nomor_agenda && <div className="text-red-600 text-xs mt-1">{errors.nomor_agenda}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="tanggal_pengajuan" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengajuan <span className="text-red-500">*</span></label>
                                        <input type="date" id="tanggal_pengajuan" name="tanggal_pengajuan" value={data.tanggal_pengajuan} onChange={(e) => setData("tanggal_pengajuan", e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" required />
                                        {errors.tanggal_pengajuan && <div className="text-red-600 text-xs mt-1">{errors.tanggal_pengajuan}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="jenis_surat_id" className="block text-sm font-medium text-gray-700 mb-1">Jenis Surat <span className="text-red-500">*</span></label>
                                        <select id="jenis_surat_id" name="jenis_surat_id" value={data.jenis_surat_id} onChange={(e) => { const selectedId = e.target.value; setData(prevData => ({ ...prevData, jenis_surat_id: selectedId, jenis_surat_manual: selectedId !== "other" ? "" : prevData.jenis_surat_manual })); }} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" required>
                                            <option value="">Pilih Jenis Surat...</option>
                                            {safeJenisSurat.map((jenis) => <option key={jenis.id} value={jenis.id}>{jenis.nama_jenis}</option>)}
                                            <option value="other">Lainnya...</option>
                                        </select>
                                        {errors.jenis_surat_id && <div className="text-red-600 text-xs mt-1">{errors.jenis_surat_id}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="urgensi_surat_id" className="block text-sm font-medium text-gray-700 mb-1">Urgensi <span className="text-red-500">*</span></label>
                                        <select id="urgensi_surat_id" name="urgensi_surat_id" value={data.urgensi_surat_id} onChange={(e) => setData("urgensi_surat_id", e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" required>
                                            <option value="">Pilih Urgensi...</option>
                                            {safeUrgensi.map((levelUrgensi) => <option key={levelUrgensi.id} value={levelUrgensi.id.toString()}>{levelUrgensi.nama_urgensi}</option>)}
                                        </select>
                                        {errors.urgensi_surat_id && <div className="text-red-600 text-xs mt-1">{errors.urgensi_surat_id}</div>}
                                    </div>
                                    {data.jenis_surat_id === "other" && (
                                        <div className="md:col-span-1 animate-fade-in">
                                            <label htmlFor="jenis_surat_manual" className="block text-sm font-medium text-gray-700 mb-1">Jenis Surat Lainnya <span className="text-red-500">*</span></label>
                                            <input type="text" id="jenis_surat_manual" name="jenis_surat_manual" value={data.jenis_surat_manual} onChange={(e) => setData("jenis_surat_manual", e.target.value)} placeholder="Contoh: Surat Rekomendasi Beasiswa" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" required />
                                            {errors.jenis_surat_manual && <div className="text-red-600 text-xs mt-1">{errors.jenis_surat_manual}</div>}
                                        </div>
                                    )}
                                    <div className={`${data.jenis_surat_id === "other" ? 'md:col-span-1' : 'md:col-span-2'}`}>
                                        <label htmlFor="tujuan_user_id" className="block text-sm font-medium text-gray-700 mb-1">Tujuan Surat <span className="text-red-500">*</span></label>
                                        <select id="tujuan_user_id" name="tujuan_user_id" value={data.tujuan_user_id} onChange={(e) => setData("tujuan_user_id", e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" required>
                                            <option value="">Pilih Tujuan...</option>
                                            {safeTujuan.map((userTujuan) => (<option key={userTujuan.id} value={userTujuan.id}>{userTujuan.jabatan_struktural?.nama_jabatan ? `${userTujuan.jabatan_struktural.nama_jabatan} (${userTujuan.name})` : userTujuan.name}</option>))}
                                        </select>
                                        {errors.tujuan_user_id && <div className="text-red-600 text-xs mt-1">{errors.tujuan_user_id}</div>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="perihal" className="block text-sm font-medium text-gray-700 mb-1">Perihal Surat <span className="text-red-500">*</span></label>
                                        <input type="text" id="perihal" name="perihal" value={data.perihal} onChange={(e) => setData("perihal", e.target.value)} placeholder="Contoh: Permohonan Izin Kunjungan Industri" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" required />
                                        {errors.perihal && <div className="text-red-600 text-xs mt-1">{errors.perihal}</div>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Isi Surat / Keterangan</label>
                                        <textarea id="keterangan" name="keterangan" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" placeholder="Jelaskan secara singkat isi atau keterangan dari surat yang diajukan..." value={data.keterangan} onChange={(e) => setData("keterangan", e.target.value)} ></textarea>
                                        {errors.keterangan && <div className="text-red-600 text-xs mt-1">{errors.keterangan}</div>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="nomor_surat" className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat Tambahan (Opsional)</label>
                                        <input type="text" id="nomor_surat" name="nomor_surat" value={data.nomor_surat} onChange={(e) => setData("nomor_surat", e.target.value)} placeholder="Contoh: 123/UND/IV/2025" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                                        {errors.nomor_surat && <div className="text-red-600 text-xs mt-1">{errors.nomor_surat}</div>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="file_surat" className="block text-sm font-medium text-gray-700 mb-1" required>Upload File Lampiran (PDF, DOCX, JPG) <span className="text-red-500">*</span></label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" /></svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500">
                                                        <span>Upload sebuah file</span>
                                                        <input id="file-upload" name="file_surat" type="file" className="sr-only" onChange={(e) => setData("file_surat", e.target.files[0])} />
                                                    </label>
                                                    <p className="pl-1">atau tarik dan lepas</p>
                                                </div>
                                                <p className="text-xs text-gray-500">Maks. 2MB</p>
                                                {data.file_surat && typeof data.file_surat.name !== 'undefined' && <p className="text-sm text-gray-700 mt-2">File dipilih: <span className="font-semibold">{data.file_surat.name}</span></p>}
                                            </div>
                                        </div>
                                        {errors.file_surat && <div className="text-red-600 text-xs mt-1">{errors.file_surat}</div>}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 border-t pt-6 mt-6">
                                    <button type="button" onClick={handleCancelForm} className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50" disabled={processing}>Batal</button>
                                    <button type="submit" disabled={processing} className="inline-flex justify-center rounded-md border border-transparent bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50">{processing ? (isEditing ? "Memperbarui..." : "Mengajukan...") : "Kirim Pengajuan"}</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Daftar Pengajuan Surat</h1>
                                    <p className="mt-1 text-gray-500">
                                        Selamat datang, {safeAuth.user.name}! Pantau status surat Anda di sini.
                                    </p>
                                </div>
                                <button
                                    onClick={handleAddNewClick}
                                    className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
                                >
                                    Ajukan Surat Baru
                                </button>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2 flex-1">
                                        <input id="search_query" type="text" placeholder="Cari Jenis Surat atau Perihal Surat" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400" />
                                    </div>
                                    <div className="md:col-span-2 flex-1">
                                        <select id="filter_status" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400">
                                            {allUniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-purple-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">NO. AGENDA</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">JENIS SURAT</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">TANGGAL PENGAJUAN</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">STATUS TERKINI</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">AKSI</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {paginatedSurat.length > 0 ? paginatedSurat.map((item) => {
                                                const statusTerkini = item.tracking?.[0]?.status?.nama_status.toLowerCase() || "";
                                                const isEditable = statusTerkini.includes("verifikasi") || statusTerkini.includes("dikembalikan");

                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-800">{item.nomor_agenda}</td>
                                                        <td className="px-6 py-4 font-medium text-gray-800">{item.jenis_surat?.nama_jenis || item.jenis_surat_manual || "N/A"}</td>
                                                        <td className="px-6 py-4 text-gray-600">{dayjs(item.tanggal_pengajuan).format("DD MMMM YYYY")}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-md inline-block ${getStatusBadgeClass(item.tracking?.[0]?.status?.nama_status)}`}>
                                                                {item.tracking?.[0]?.status?.nama_status || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 flex items-center space-x-2">
                                                            <button onClick={() => openDetailModal(item)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Lihat Detail"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></button>
                                                            <button onClick={() => handleEditClick(item)} disabled={!isEditable} className={`transition-colors ${isEditable ? "text-amber-500 hover:text-amber-700" : "text-gray-300 cursor-not-allowed"}`} title={isEditable ? "Edit Surat" : "Surat tidak dapat diedit lagi karena sudah di verifikasi"}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : (
                                                <tr><td colSpan={5} className="py-10 text-center text-gray-400">Tidak ada pengajuan surat.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </div>
                        </>
                    )}
                </div>
            </main>
            {selectedSurat && (
                <DetailModal surat={selectedSurat} onClose={closeDetailModal} />
            )}
        </div>
    );
};

export default PengajuDashboard;
