import React, { useMemo, useState, useEffect } from 'react';

// =======================================================================
// Komponen Notifikasi (Pengganti Alert)
// =======================================================================
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const baseClasses = "fixed top-5 right-5 z-[100] flex items-center p-4 max-w-sm w-full rounded-lg shadow-lg text-white animate-fade-in-down";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
    };

    // Auto-close after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);


    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="text-sm font-medium flex-grow">
                {message}
            </div>
            <button onClick={onClose} className="ml-4 -mr-1 p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};


// =======================================================================
// 1. DUMMY DATA (Hanya sebagai fallback jika props kosong)
// =======================================================================
const initialDummySuratData = [
    {
        id: 'dummy-1',
        nomor_agenda: 'S/2025/DUMMY001',
        perihal: 'Contoh Surat Dummy',
        tanggal_pengajuan: '2025-01-01',
        ditujukan_kepada: 'Pihak Contoh',
        urgensi: { nama_urgensi: 'Biasa' },
        isi_surat: 'Ini adalah isi surat dummy.',
        file_path: null,
        status_terkini: 'Diajukan',
        tracking: [{ created_at: '2025-01-01 09:00:00', user: { name: 'Sistem Dummy' }, status: { nama_status: 'Diajukan' }, catatan: 'Surat dummy diajukan.' }],
        jenis_surat: { nama_jenis: 'Surat Keterangan Dummy' },
        jenis_surat_manual: null,
        tujuan: { name: 'Direktur Dummy' }
    },
];

// =======================================================================
// 2. KOMPONEN-KOMPONEN MODAL & PAGINATION
// =======================================================================
const DetailModal = ({ surat, onClose }) => {
    const getStatusBadgeClass = (status) => {
        if (status && status.toLowerCase().includes('selesai')) return 'bg-green-100 text-green-800';
        if (status && status.toLowerCase().includes('dikembalikan')) return 'bg-red-100 text-red-800';
        if (status && status.toLowerCase().includes('didisposisikan')) return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border-t-4 border-violet-500 bg-white p-8 shadow-2xl">
                <button type="button" className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700" onClick={onClose}>
                    &times;
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">Detail Surat : {surat.perihal}</h2>

                {/* Informasi Surat */}
                <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">Informasi Surat</h3>
                    <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-gray-700 md:grid-cols-2">
                        <p>
                            <strong className="font-medium text-gray-500">No. Agenda:</strong> {surat.nomor_agenda}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">Ditujukan Kepada:</strong> {surat.tujuan?.name || 'N/A'}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">Tgl. Pengajuan:</strong> {surat.tanggal_pengajuan}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">Urgensi:</strong> {surat.urgensi?.nama_urgensi || 'N/A'}
                        </p>
                        <p>
                            <strong className="font-medium text-gray-500">Perihal:</strong> {surat.perihal}
                        </p>
                        <p>
                            <strong className="col-span-2 font-medium text-gray-500">Status Terkini:</strong>{' '}
                            <span className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(surat.tracking?.[0]?.status?.nama_status || surat.status_terkini)}`}>
                                {surat.tracking?.[0]?.status?.nama_status || surat.status_terkini || 'N/A'}
                            </span>
                        </p>
                    </div>
                    <div className="mt-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-800">Isi Surat:</h4>
                        <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                            <p>{surat.keterangan || surat.isi_surat}</p>
                        </div>
                    </div>
                    {surat.file_path && (
                        <a
                            href={`/storage/${surat.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center text-sm font-medium text-violet-700 hover:underline"
                        >
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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

                {/* Riwayat Tracking */}
                <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">Riwayat Tracking</h3>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    <th className="px-4 py-2">Tanggal & Waktu</th>
                                    <th className="px-4 py-2">Aksi Oleh</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Catatan/Instruksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white text-sm">
                                {surat.tracking?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-gray-700">{item.created_at}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.user?.name || 'Sistem'}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.status?.nama_status || 'N/A'}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.catatan}</td>
                                    </tr>
                                )) || (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-3 text-center text-gray-500">Tidak ada riwayat tracking.</td>
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
                    className={`rounded-lg px-3 py-1 transition ${currentPage === page ? 'bg-violet-600 font-bold text-white shadow-md' : 'bg-violet-50 text-violet-700 hover:bg-violet-200'}`}
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
// 3. KOMPONEN DASHBOARD UTAMA
// =======================================================================
const PengajuDashboard = ({ auth, suratMasuk, jenisSurat, urgensi, tujuan, user }) => {
    // State untuk data dari props, dengan fallback jika props kosong
    const [allSurat, setAllSurat] = useState(suratMasuk || initialDummySuratData);
    const [safeJenisSurat, setSafeJenisSurat] = useState(jenisSurat || []);
    const [safeUrgensi, setSafeUrgensi] = useState(urgensi || []);
    const [safeTujuan, setSafeTujuan] = useState(tujuan || []);
    const [safeAuth, setSafeAuth] = useState(auth || { user: { name: 'Pengguna' }});
    const [safeUser, setSafeUser] = useState(user || { name: 'Pengguna' });

    // State untuk fungsionalitas UI
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showForm, setShowForm] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // State untuk form
    const initialFormState = {
        jenis_surat_id: '',
        jenis_surat_manual: '',
        urgensi_surat_id: '',
        tujuan_user_id: '',
        tanggal_pengajuan: new Date().toISOString().slice(0, 10),
        keterangan: '',
        nomor_surat: '',
        perihal: '',
        file_surat: null,
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Sinkronisasi state dengan props jika props berubah
    useEffect(() => {
        setAllSurat(suratMasuk || initialDummySuratData);
        setSafeJenisSurat(jenisSurat || []);
        setSafeUrgensi(urgensi || []);
        setSafeTujuan(tujuan || []);
        setSafeAuth(auth || { user: { name: 'Pengguna' }});
        setSafeUser(user || { name: 'Pengguna' });
    }, [suratMasuk, jenisSurat, urgensi, tujuan, auth, user]);


    useEffect(() => {
        document.title = showForm ? "Formulir Pengajuan Surat" : "Dashboard Pengaju";
    }, [showForm]);


    const paginatedSurat = useMemo(() => {
        if (!allSurat) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allSurat.slice(startIndex, startIndex + itemsPerPage);
    }, [allSurat, currentPage]);

    const totalPages = allSurat ? Math.ceil(allSurat.length / itemsPerPage) : 1;

    const openDetailModal = (surat) => setSelectedSurat(surat);
    const closeDetailModal = () => setSelectedSurat(null);

    const getStatusBadgeClass = (status) => {
        if (status && status.toLowerCase().includes('selesai')) return 'bg-green-100 text-green-800';
        if (status && status.toLowerCase().includes('dikembalikan')) return 'bg-red-100 text-red-800';
        if (status && status.toLowerCase().includes('didisposisikan')) return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const handleSetData = (key, value) => {
        setFormData(prev => ({...prev, [key]: value}));
    };

    const handleJenisSuratChange = (e) => {
        const selectedId = e.target.value;
        handleSetData('jenis_surat_id', selectedId);
        if (selectedId !== 'other') {
            handleSetData('jenis_surat_manual', '');
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setFormErrors({});
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setFormErrors({});

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            setNotification({ message: 'Kesalahan Keamanan: Token CSRF tidak ditemukan.', type: 'error' });
            setIsProcessing(false);
            return;
        }

        const submissionData = new FormData();
        for (const key in formData) {
             // Handle null values by appending an empty string, or exclude files if null
             if (key === 'file_surat' && formData[key] === null) {
                // Do not append if file_surat is null, as backend expects no file for nullable
                continue;
             }
            submissionData.append(key, formData[key]);
        }

        try {
            const response = await fetch('/pengaju/suratmasuk', {
                method: 'POST',
                body: submissionData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
            });

            // PERBAIKAN: Menangani spesifik error CSRF mismatch (status 419)
            if (response.status === 419) {
                setNotification({ message: 'Sesi Anda telah kadaluarsa. Mohon refresh halaman dan coba lagi.', type: 'error' });
                setIsProcessing(false);
                return; // Hentikan eksekusi lebih lanjut
            }

            // PERBAIKAN: Memeriksa apakah respons adalah JSON sebelum mencoba memparsingnya
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();

                if (response.status === 422) {
                    setFormErrors(responseData.errors);
                    setNotification({ message: 'Gagal mengirim, periksa kembali kolom yang wajib diisi.', type: 'error' });
                } else if (!response.ok) {
                    // Ini menangani error server non-419/non-422 yang merespons JSON
                    throw new Error(responseData.message || 'Terjadi kesalahan pada server.');
                } else {
                    setAllSurat(prevSurat => [responseData.surat, ...prevSurat]);
                    setNotification({ message: 'Pengajuan surat berhasil dikirim!', type: 'success' });
                    resetForm();
                    setShowForm(false);
                    setCurrentPage(1);
                }
            } else {
                // Respons bukan JSON (kemungkinan besar HTML error page)
                const errorText = await response.text(); // Ambil teks respons mentah (biasanya HTML)
                console.error('Server merespons dengan konten non-JSON:', errorText);
                setNotification({ message: 'Terjadi kesalahan tidak terduga pada server. Mohon coba lagi atau hubungi admin.', type: 'error' });
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            // Tangani error jaringan atau error parsing JSON yang tidak tertangkap oleh pemeriksaan contentType
            setNotification({ message: error.message || 'Tidak dapat terhubung ke server. Pastikan koneksi Anda stabil.', type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditClick = (surat) => {
        console.log('Edit Surat:', surat);
        setNotification({ message: `Fitur Edit untuk ID: ${surat.id} belum tersedia.`, type: 'success' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, message: '' })}
            />

            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <img className="block h-8 w-auto" src="https://via.placeholder.com/32x32?text=ES" alt="E-Surat Logo" />
                                <span className="ml-2 text-xl font-bold text-gray-800">e-Surat</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">Selamat datang, {safeAuth.user.name || safeUser.name}!</span>
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-2 0V4H5v12h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M11.707 6.293a1 1 0 010 1.414L9.414 10l2.293 2.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showForm ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-in">
                            <h2 className="mb-2 text-2xl font-bold text-gray-800">Formulir Pengajuan Surat</h2>
                            <p className="mb-6 text-gray-500">Isi data di bawah ini dengan lengkap untuk mengajukan surat baru.</p>

                            <form onSubmit={handleFormSubmit} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="jenis_surat_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Jenis Surat
                                        </label>
                                        <select
                                            id="jenis_surat_id"
                                            name="jenis_surat_id"
                                            value={formData.jenis_surat_id}
                                            onChange={handleJenisSuratChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Pilih Jenis Surat...</option>
                                            {safeJenisSurat.map((jenis) => (
                                                <option key={jenis.id} value={jenis.id}>
                                                    {jenis.nama_jenis}
                                                </option>
                                            ))}
                                            <option value="other">Lainnya...</option>
                                        </select>
                                        {formErrors.jenis_surat_id && <div className="text-red-600 text-xs mt-1">{formErrors.jenis_surat_id[0]}</div>}
                                    </div>

                                    {formData.jenis_surat_id === 'other' && (
                                        <div className="animate-fade-in">
                                            <label htmlFor="jenis_surat_manual" className="block text-sm font-medium text-gray-700 mb-1">
                                                Jenis Surat Lainnya
                                            </label>
                                            <input
                                                type="text"
                                                id="jenis_surat_manual"
                                                name="jenis_surat_manual"
                                                value={formData.jenis_surat_manual}
                                                onChange={(e) => handleSetData('jenis_surat_manual', e.target.value)}
                                                placeholder="Contoh: Surat Rekomendasi Beasiswa"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                                required
                                            />
                                            {formErrors.jenis_surat_manual && <div className="text-red-600 text-xs mt-1">{formErrors.jenis_surat_manual[0]}</div>}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="tanggal_pengajuan" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal Pengajuan
                                        </label>
                                        <input
                                            type="date"
                                            id="tanggal_pengajuan"
                                            name="tanggal_pengajuan"
                                            value={formData.tanggal_pengajuan}
                                            onChange={(e) => handleSetData('tanggal_pengajuan', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        />
                                        {formErrors.tanggal_pengajuan && <div className="text-red-600 text-xs mt-1">{formErrors.tanggal_pengajuan[0]}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="nomor_surat" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nomor Surat (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            id="nomor_surat"
                                            name="nomor_surat"
                                            value={formData.nomor_surat}
                                            onChange={(e) => handleSetData('nomor_surat', e.target.value)}
                                            placeholder="Ketik nomor surat jika ada..."
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                        />
                                        {formErrors.nomor_surat && <div className="text-red-600 text-xs mt-1">{formErrors.nomor_surat[0]}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="perihal" className="block text-sm font-medium text-gray-700 mb-1">
                                            Perihal Surat
                                        </label>
                                        <input
                                            type="text"
                                            id="perihal"
                                            name="perihal"
                                            value={formData.perihal}
                                            onChange={(e) => handleSetData('perihal', e.target.value)}
                                            placeholder="Contoh: Permohonan Izin Kunjungan Industri"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        />
                                        {formErrors.perihal && <div className="text-red-600 text-xs mt-1">{formErrors.perihal[0]}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="tujuan_user_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Ditujukan Kepada
                                        </label>
                                        <select
                                            id="tujuan_user_id"
                                            name="tujuan_user_id"
                                            value={formData.tujuan_user_id}
                                            onChange={(e) => handleSetData('tujuan_user_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Pilih Tujuan...</option>
                                            {safeTujuan.map((userTujuan) => (
                                                <option key={userTujuan.id} value={userTujuan.id}>
                                                    {userTujuan.jabatan_struktural?.jabatan_struktural || userTujuan.name} ({userTujuan.name})
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.tujuan_user_id && <div className="text-red-600 text-xs mt-1">{formErrors.tujuan_user_id[0]}</div>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Isi Surat
                                    </label>
                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        rows="5"
                                        value={formData.keterangan}
                                        onChange={(e) => handleSetData('keterangan', e.target.value)}
                                        placeholder="Tuliskan isi atau keterangan singkat mengenai surat Anda di sini..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm resize-y"
                                        required
                                    ></textarea>
                                    {formErrors.keterangan && <div className="text-red-600 text-xs mt-1">{formErrors.keterangan[0]}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="file_surat" className="block text-sm font-medium text-gray-700 mb-1">
                                            Unggah Draft Surat (PDF/Docx)
                                        </label>
                                        <input
                                            type="file"
                                            id="file_surat"
                                            name="file_surat"
                                            onChange={(e) => handleSetData('file_surat', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                        />
                                        {formErrors.file_surat && <div className="text-red-600 text-xs mt-1">{formErrors.file_surat[0]}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="urgensi_surat_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tingkat Urgensi
                                        </label>
                                        <select
                                            id="urgensi_surat_id"
                                            name="urgensi_surat_id"
                                            value={formData.urgensi_surat_id}
                                            onChange={(e) => handleSetData('urgensi_surat_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Pilih Tingkat Urgensi...</option>
                                            {safeUrgensi.map((levelUrgensi) => (
                                                <option key={levelUrgensi.id} value={levelUrgensi.id.toString()}>
                                                    {levelUrgensi.nama_urgensi}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.urgensi_surat_id && <div className="text-red-600 text-xs mt-1">{formErrors.urgensi_surat_id[0]}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 border-t pt-6 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            setShowForm(false);
                                        }}
                                        className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Mengajukan...' : 'Submit Pengajuan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">Daftar Pengajuan Surat</h1>
                                    <p className="mt-1 text-gray-500">Selamat datang, {safeAuth.user.name || safeUser.name}! Pantau status surat Anda di sini.</p>
                                </div>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md transition-transform transform hover:scale-105"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Ajukan Surat Baru
                                </button>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">NOMOR AGENDA</th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">JENIS SURAT</th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">TANGGAL PENGAJUAN</th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">STATUS</th>
                                                <th className="px-6 py-3 text-left font-sans text-xs font-bold tracking-wider text-gray-500 uppercase">AKSI</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {paginatedSurat.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-800">{item.nomor_agenda}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-800">{item.jenis_surat?.nama_jenis || item.jenis_surat_manual || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-gray-600">{item.tanggal_pengajuan}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusBadgeClass(item.tracking?.[0]?.status?.nama_status || item.status_terkini)}`}
                                                        >
                                                            {item.tracking?.[0]?.status?.nama_status || item.status_terkini || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 flex items-center space-x-2">
                                                        <button onClick={() => openDetailModal(item)} className="text-gray-400 hover:text-blue-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => handleEditClick(item)} className="text-gray-400 hover:text-green-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedSurat.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="py-10 text-center text-gray-400">
                                                        Tidak ada pengajuan surat.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {selectedSurat && <DetailModal surat={selectedSurat} onClose={closeDetailModal} />}
        </div>
    );
}

// Ekspor komponen utama sebagai default
export default PengajuDashboard;
