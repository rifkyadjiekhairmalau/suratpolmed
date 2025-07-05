import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import BagianUmumLayout from '@/layouts/BagianUmumLayout';
import Swal from 'sweetalert2';
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
// HELPER COMPONENTS
// =======================================================================
const DetailItem = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2.5 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="sm:col-span-2 text-sm text-gray-800">{children}</dd>
    </div>
);

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
                    {getIcon(item.status)}
                </div>
            </div>
            <div className="flex-grow pl-4">
                <p className="text-sm font-medium text-gray-800">{item.status}</p>
                <p className="text-sm text-gray-500">{dayjs(item.tanggal).format("DD MMM YYYY, HH:mm")}</p>
                <p className="mt-1 text-xs text-gray-500">Oleh: {item.aksi_oleh}</p>
                {item.catatan && <p className="mt-2 text-xs italic bg-yellow-100 border border-yellow-200 text-yellow-800 p-2 rounded-md">"{item.catatan}"</p>}
            </div>
        </div>
    );
};

// =======================================================================
// MODAL COMPONENTS
// =======================================================================
const VerifikasiModal = ({ surat, onClose, onVerifikasi, onKembalikan }) => {
    const [catatan, setCatatan] = useState('');
    const handleKembalikanClick = () => {
        if (!catatan.trim()) {
            Swal.fire({ icon: 'warning', title: 'Input Kosong', text: 'Alasan pengembalian/penolakan harus diisi!' });
            return;
        }
        onKembalikan(catatan);
    };
    const handleVerifikasiClick = () => {
        onVerifikasi(catatan);
    };
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-gray-200">
                <header className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
                    <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
                    <h2 className="text-2xl font-bold text-gray-800">Proses Verifikasi: {surat.perihal}</h2>
                </header>
                <div className="overflow-y-auto p-6 space-y-8">
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Informasi Surat</h3>
                        <dl>
                            <DetailItem label="No. Agenda">{surat.no_agenda}</DetailItem>
                            <DetailItem label="Perihal">{surat.perihal}</DetailItem>
                            <DetailItem label="Pengaju">{surat.pengaju}</DetailItem>
                            <DetailItem label="Ditujukan Kepada">{surat.ditujukan_kepada}</DetailItem>
                            <DetailItem label="Jenis Surat">{surat.jenis_surat}</DetailItem>
                            <DetailItem label="Tgl. Pengajuan">{dayjs(surat.tgl_pengajuan).format("DD MMMM YYYY")}</DetailItem>
                            <DetailItem label="Urgensi"><span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">{surat.urgensi}</span></DetailItem>
                            <DetailItem label="File Surat">
                                <a href={surat.file_surat} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">
                                    <FileTextOutlined className="mr-2" /> Lihat File
                                </a>
                            </DetailItem>
                        </dl>
                        <div className="mt-5">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Isi Surat / Keterangan</h4>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 max-h-32 text-sm overflow-y-auto whitespace-pre-wrap">
                                {surat.isi_surat || "Tidak ada isi surat."}
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Formulir Verifikasi</h3>
                         <div>
                            <label htmlFor="tu_verification_notes" className="block text-gray-700 text-sm font-medium mb-2">Alasan Penolakan</label>
                            <textarea id="tu_verification_notes" rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 text-sm" placeholder="Wajib diisi jika surat dikembalikan/ditolak. Opsional jika diverifikasi..."></textarea>
                        </div>
                    </section>
                </div>
                <footer className="p-4 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 bg-white rounded-b-2xl z-10">
                    <button type="button" className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-200 text-sm" onClick={onClose}>Batal</button>
                    <button type="button" className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-200 text-sm" onClick={handleKembalikanClick}>Tolak & Kembalikan</button>
                    <button type="button" className="px-6 py-2 bg-violet-700 text-white rounded-lg font-semibold hover:bg-violet-800 transition duration-200 shadow-sm text-sm" onClick={handleVerifikasiClick}>Verifikasi & Lanjutkan</button>
                </footer>
            </div>
        </div>
    );
};

const DetailModal = ({ surat, onClose }) => (
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
                        <DetailItem label="No. Agenda">{surat.no_agenda}</DetailItem>
                        <DetailItem label="Perihal">{surat.perihal}</DetailItem>
                        <DetailItem label="Pengaju">{surat.pengaju}</DetailItem>
                        <DetailItem label="Ditujukan Kepada">{surat.ditujukan_kepada}</DetailItem>
                        <DetailItem label="Jenis Surat">{surat.jenis_surat}</DetailItem>
                        <DetailItem label="Tgl. Pengajuan">{dayjs(surat.tgl_pengajuan).format("DD MMMM YYYY")}</DetailItem>
                        <DetailItem label="Urgensi"><span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">{surat.urgensi}</span></DetailItem>
                        <DetailItem label="File Surat">
                            <a href={surat.file_surat} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">
                                <FileTextOutlined className="mr-2" /> Lihat File
                            </a>
                        </DetailItem>
                    </dl>
                    <div className="mt-5">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Isi Surat / Keterangan</h4>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 max-h-32 text-sm overflow-y-auto whitespace-pre-wrap">
                            {surat.isi_surat || "Tidak ada isi surat."}
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Riwayat Tracking</h3>
                    <div className="flow-root">
                        {(surat.tracking_history || []).length > 0 ? (
                            (surat.tracking_history || []).map((item, index) => (
                                <TrackingItem key={index} item={item} isLast={index === surat.tracking_history.length - 1} />
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


// =======================================================================
// KOMPONEN UTAMA DASHBOARD
// =======================================================================
export default function Dashboard({ auth, totalSuratMasuk, totalSuratKeluar, suratBelumVerifikasiCount, suratUntukVerifikasi, adminUser }) {

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash && flash.success) { Swal.fire({ icon: "success", title: "Berhasil!", text: flash.success, timer: 3000, showConfirmButton: false, }); }
        if (flash && flash.error) { Swal.fire({ icon: "error", title: "Terjadi Kesalahan!", text: flash.error, }); }
    }, [flash]);

    const transformSuratData = (surat) => ({
        id: surat.id,
        no_agenda: surat.nomor_agenda || '',
        tgl_pengajuan: surat.created_at, // Mengirim tanggal mentah
        perihal: surat.perihal || '',
        jenis_surat: surat.jenis_surat?.nama_jenis || surat.jenis_surat_manual || 'N/A',
        pengaju: surat.pengaju?.name || 'N/A',
        status_terkini: surat.tracking.length > 0 ? surat.tracking[0].status.nama_status : 'Belum ada status',
        ditujukan_kepada: surat.tujuan?.jabatanStruktural?.nama_jabatan || surat.tujuan?.name || 'N/A',
        urgensi: surat.urgensi?.nama_urgensi || 'Biasa',
        isi_surat: surat.keterangan || '',
        file_surat: surat.file_path ? `/storage/${surat.file_path}` : null,
        tracking_history: surat.tracking.map(t => ({
            // [FIX]: Mengirim data tanggal asli (ISO String)
            tanggal: t.created_at,
            aksi_oleh: t.user?.name || 'Sistem',
            status: t.status?.nama_status || 'N/A',
            catatan: t.catatan || '',
        })),
    });

    // ... (Sisa state dan fungsi lain tetap sama)
    const [daftarSurat, setDaftarSurat] = useState([]);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [modalState, setModalState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (suratUntukVerifikasi) {
            setDaftarSurat(suratUntukVerifikasi.map(transformSuratData));
        }
    }, [suratUntukVerifikasi]);

    const filteredSurat = useMemo(() => {
        let filtered = daftarSurat.filter(surat =>
            (surat.perihal || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (surat.no_agenda || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (surat.jenis_surat || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        const STATUS_OPTIONS = Array.from(new Set(daftarSurat.map(s => s.status_terkini))).filter(Boolean);
        if (statusFilter !== 'Semua Status') {
            filtered = filtered.filter(surat => surat.status_terkini.toLowerCase() === statusFilter.toLowerCase());
        }
        return filtered;
    }, [daftarSurat, searchQuery, statusFilter]);

    const { paginatedSurat, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredSurat.length / ITEMS_PER_PAGE);
        const paginatedData = filteredSurat.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return { paginatedSurat: paginatedData, totalPages };
    }, [filteredSurat, currentPage]);

    const handleOpenModal = (surat, type) => { setSelectedSurat(surat); setModalState(type); };
    const handleCloseModal = () => { setModalState(null); setSelectedSurat(null); router.reload({ only: ['suratUntukVerifikasi', 'flash'], preserveScroll: true }); };
    const handlePageChange = (page) => { if (page >= 1 && page <= totalPages) { setCurrentPage(page); } };
    const handleVerifikasi = (catatan) => {
        if (!selectedSurat) return;
        router.post(route('administrasi_umum.suratmasuk.verify', { suratMasuk: selectedSurat.id }), { catatan: catatan, }, {
            onSuccess: () => { handleCloseModal(); Swal.fire('Berhasil!', 'Surat berhasil diverifikasi dan diteruskan.', 'success'); },
            onError: (errors) => { console.error("Verifikasi Error:", errors); Swal.fire('Gagal!', errors.catatan || 'Terjadi kesalahan saat memverifikasi surat.', 'error'); },
            preserveScroll: true,
        });
    };
    const handleKembalikan = (alasan) => {
        if (!selectedSurat) return;
        router.post(route('administrasi_umum.suratmasuk.reject', { suratMasuk: selectedSurat.id }), { catatan_penolakan: alasan, }, {
            onSuccess: () => { handleCloseModal(); Swal.fire('Berhasil!', 'Surat berhasil ditolak.', 'success'); },
            onError: (errors) => { console.error("Penolakan Error:", errors); Swal.fire('Gagal!', errors.catatan_penolakan || 'Terjadi kesalahan saat menolak surat.', 'error'); },
            preserveScroll: true,
        });
    };
    const getStatusBadgeClass = (status) => {
        if (typeof status !== 'string') return 'bg-gray-100 text-gray-800';
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('menunggu')) return 'bg-yellow-100 text-yellow-800';
        if (lowerStatus.includes('selesai')) return 'bg-green-100 text-green-800';
        if (lowerStatus.includes('disposisi')) return 'bg-blue-100 text-blue-800';
        if (lowerStatus.includes('dikembalikan') || lowerStatus.includes('ditolak')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };
    const allUniqueStatuses = useMemo(() => {
        const statuses = new Set(daftarSurat.map(s => s.status_terkini).filter(Boolean));
        return ["Semua Status", ...Array.from(statuses).sort()];
    }, [daftarSurat]);
    const StatCard = ({ title, value, icon }) => (
        <div className="group bg-white p-6 rounded-2xl shadow-lg flex items-center gap-5 border border-transparent transition-all duration-200 cursor-pointer hover:border-violet-500 hover:shadow-xl hover:-translate-y-1 hover:bg-violet-50">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-violet-100 group-hover:bg-violet-500 transition-all duration-200">
                {React.cloneElement(icon, { className: "h-7 w-7 text-violet-500 group-hover:text-white transition-all duration-200" })}
            </div>
            <div>
                <p className="text-black-500 text-sm font-semi-bold group-hover:text-violet-700 transition">{title}</p>
                <p className="text-3xl font-extrabold text-gray-800 group-hover:text-violet-900 transition">{value}</p>
            </div>
        </div>
    );
    const SuratMasukIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-input-icon lucide-file-input"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>);
    const SuratKeluarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-output-icon lucide-file-output"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2"/><path d="M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6"/><path d="m5 11-3 3"/><path d="m5 17-3-3h10"/></svg>);
    const SuratMenungguIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-clock-icon lucide-file-clock"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="M8 14v2.2l1.6 1"/><circle cx="8" cy="16" r="6"/></svg>);
    const Pagination = ({ currentPage, totalPages, onPageChange }) => (
        <div className="flex justify-center items-center mt-8">
            <nav className="flex items-center gap-2" aria-label="Pagination">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">&laquo; Prev</button>
                <div className="flex items-center gap-2">
                    {[...Array(totalPages).keys()].map(num => (
                        <button key={num + 1} onClick={() => onPageChange(num + 1)} className={`w-10 h-10 flex items-center justify-center font-bold rounded-md transition-all ${currentPage === num + 1 ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} aria-current={currentPage === num + 1 ? 'page' : undefined}>
                            {num + 1}
                        </button>
                    ))}
                </div>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">Next &raquo;</button>
            </nav>
        </div>
    );

    return (
        <BagianUmumLayout user={auth.user}>
            <Head title="Dashboard Bagian Umum" />
            <main className="min-h-screen bg-gray-50 p-2 md:p-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Dashboard Administrasi Umum</h1>
                    <p className="text-gray-600 mb-4">Kelola surat masuk, surat keluar dan pantau alur disposisi.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 font-bold">
                        <StatCard title="Total Surat Masuk" value={totalSuratMasuk} icon={<SuratMasukIcon />} />
                        <StatCard title="Total Surat Keluar" value={totalSuratKeluar} icon={<SuratKeluarIcon />} />
                        <StatCard title="Total Surat Menunggu Verifikasi" value={suratBelumVerifikasiCount} icon={<SuratMenungguIcon />} />
                    </div>
                    <div className="bg-white backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex flex-col mb-4">
                            <h2 className="text-xl font-bold text-gray-700 mb-3">Surat Baru Menunggu Verifikasi</h2>
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="relative flex-grow">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input type="text" placeholder="Cari perihal atau no. agenda..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className=" w-1/2 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 text-sm w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-purple-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">No. Agenda</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Jenis Surat</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Pengaju</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Status Terkini</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-black-600 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {paginatedSurat.length > 0 ? (
                                        paginatedSurat.map(surat => (
                                            <tr key={surat.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-black-60">{surat.no_agenda}</td>
                                                <td className="px-6 py-4 max-w-xs truncate">{surat.jenis_surat}</td>
                                                <td className="px-6 py-4 text-black-600">{surat.pengaju}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-md inline-block ${getStatusBadgeClass(surat.status_terkini)}`}>
                                                        {surat.status_terkini}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center items-center gap-4">
                                                        <button onClick={() => handleOpenModal(surat, 'detail')} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Lihat Detail">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                                        </button>
                                                        <button onClick={() => handleOpenModal(surat, 'verifikasi')} className="bg-violet-600 text-white px-3 py-1 rounded-md hover:bg-violet-700 font-semibold transition text-xs">Proses</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada surat yang perlu diverifikasi.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />)}
                    </div>
                    {modalState === 'verifikasi' && selectedSurat && (<VerifikasiModal surat={selectedSurat} onClose={handleCloseModal} onVerifikasi={handleVerifikasi} onKembalikan={handleKembalikan} />)}
                    {modalState === 'detail' && selectedSurat && (<DetailModal surat={selectedSurat} onClose={handleCloseModal} />)}
                </div>
            </main>
        </BagianUmumLayout>
    );
}
