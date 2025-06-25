import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

// --- 1. DUMMY DATA UNTUK PEGAWAI (Tipe data dihilangkan) ---

const JABATAN_FUNGSIONAL_OPTIONS = ['Dosen', 'Pranata Komputer', 'Arsiparis', 'Pustakawan', 'Lainnya'];
const JABATAN_STRUKTURAL_OPTIONS = ['Tidak Ada', 'Direktur', 'Wakil Direktur', 'Kepala Bagian', 'Kepala Sub Bagian'];
const JENIS_PEGAWAI_OPTIONS = ['PNS', 'PPPK', 'Honorer'];

const dummyPegawai = [
    { id: 1, nip: '198503152010011001', nama: 'Ahmad Subarjo', gelar_depan: 'Dr.', gelar_belakang: 'M.Kom', tempat_lahir: 'Medan', tgl_lahir: '1985-03-15', email: 'ahmad.s@example.com', jabatan: 'Dosen', jabatan_struktural: 'Wakil Direktur', jenis_pegawai: 'PNS' },
    { id: 2, nip: '199007202015032002', nama: 'Bunga Citra', gelar_belakang: 'S.Kom', tempat_lahir: 'Jakarta', tgl_lahir: '1990-07-20', email: 'bunga.c@example.com', jabatan: 'Pranata Komputer', jabatan_struktural: 'Tidak Ada', jenis_pegawai: 'PNS' },
    { id: 3, nip: 'H07202501003', nama: 'Rudi Hartono', tempat_lahir: 'Surabaya', tgl_lahir: '1992-01-30', email: 'rudi.h@example.com', jabatan: 'Arsiparis', jabatan_struktural: 'Tidak Ada', jenis_pegawai: 'Honorer' },
    { id: 4, nip: '198811102014021004', nama: 'Santoso', gelar_depan: 'Prof. Dr. Ir.', tempat_lahir: 'Yogyakarta', tgl_lahir: '1988-11-10', email: 'santoso@example.com', jabatan: 'Dosen', jabatan_struktural: 'Direktur', jenis_pegawai: 'PNS' },
    { id: 5, nip: '199501012020122001', nama: 'Diana Putri', gelar_belakang: 'S.E.', tempat_lahir: 'Bandung', tgl_lahir: '1995-01-01', email: 'diana.p@example.com', jabatan: 'Staf Administrasi', jabatan_struktural: 'Kepala Sub Bagian', jenis_pegawai: 'PPPK' },
    { id: 6, nip: '199205252018031005', nama: 'Eko Yulianto', gelar_belakang: 'A.Md.Kom', tempat_lahir: 'Semarang', tgl_lahir: '1992-05-25', email: 'eko.y@example.com', jabatan: 'Pranata Komputer', jabatan_struktural: 'Tidak Ada', jenis_pegawai: 'PNS' },
    { id: 7, nip: 'H05202408007', nama: 'Fitriani', tempat_lahir: 'Makassar', tgl_lahir: '1998-08-17', email: 'fitriani@example.com', jabatan: 'Pustakawan', jabatan_struktural: 'Tidak Ada', jenis_pegawai: 'Honorer' },
];


// --- 2. KOMPONEN-KOMPONEN MODAL (Tidak ada perubahan di sini) ---

const PegawaiFormModal = ({ pegawai, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        pegawai || { nip: '', nama: '', jenis_pegawai: 'PNS', jabatan: JABATAN_FUNGSIONAL_OPTIONS[0], jabatan_struktural: JABATAN_STRUKTURAL_OPTIONS[0] }
    );
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    const inputStyle = "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400";
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{pegawai ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">NIP</label><input type="text" name="nip" value={formData.nip} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Gelar Depan</label><input type="text" name="gelar_depan" value={formData.gelar_depan} onChange={handleChange} className={inputStyle} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label><input type="text" name="nama" value={formData.nama} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Gelar Belakang</label><input type="text" name="gelar_belakang" value={formData.gelar_belakang} onChange={handleChange} className={inputStyle} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Tempat Lahir</label><input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Lahir</label><input type="date" name="tgl_lahir" value={formData.tgl_lahir} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Jabatan Fungsional</label><select name="jabatan" value={formData.jabatan} onChange={handleChange} className={inputStyle}>{JABATAN_FUNGSIONAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Jabatan Struktural</label><select name="jabatan_struktural" value={formData.jabatan_struktural} onChange={handleChange} className={inputStyle}>{JABATAN_STRUKTURAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pegawai</label><select name="jenis_pegawai" value={formData.jenis_pegawai} onChange={handleChange} className={inputStyle}>{JENIS_PEGAWAI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t"><button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Batal</button><button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold">Simpan</button></div>
            </form>
        </div>
    );
};
const DeleteConfirmModal = ({ pegawai, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600">Anda yakin ingin menghapus data pegawai <strong className="font-semibold">{pegawai.nama}</strong>?</p>
            <div className="flex justify-end gap-4 mt-8"><button onClick={onClose} className="px-6 py-2 border rounded-lg">Batal</button><button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Ya, Hapus</button></div>
        </div>
    </div>
);
const DetailPegawaiModal = ({ pegawai, onClose }) => {
    const DetailItem = ({ label, value }) => (
        <div><p className="text-sm text-gray-500">{label}</p><p className="font-semibold text-gray-800">{value || '-'}</p></div>
    );
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semi-bold text-gray-800 mb-6">Detail Pegawai</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailItem label="Nama Lengkap" value={`${pegawai.gelar_depan || ''} ${pegawai.nama} ${pegawai.gelar_belakang || ''}`.trim()} />
                    <DetailItem label="NIP" value={pegawai.nip} />
                    <DetailItem label="Email" value={pegawai.email} />
                    <DetailItem label="Kelahiran" value={`${pegawai.tempat_lahir}, ${new Date(pegawai.tgl_lahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`} />
                    <DetailItem label="Jabatan Fungsional" value={pegawai.jabatan} />
                    <DetailItem label="Jabatan Struktural" value={pegawai.jabatan_struktural} />
                    <DetailItem label="Jenis Pegawai" value={pegawai.jenis_pegawai} />
                </div>
                <div className="flex justify-end mt-8 pt-6 border-t"><button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200">Tutup</button></div>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <nav className="flex items-center justify-center gap-4 mt-6" aria-label="Pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed">&laquo; Prev</button>
            <div className="flex items-center gap-2">
                {[...Array(totalPages).keys()].map(num => (
                    <button key={num + 1} onClick={() => onPageChange(num + 1)} className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${currentPage === num + 1 ? 'bg-violet-600 text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`} aria-current={currentPage === num + 1 ? 'page' : undefined}>
                        {num + 1}
                    </button>
                ))}
            </div>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed">Next &raquo;</button>
        </nav>
    );
};


// --- 3. KOMPONEN HALAMAN UTAMA ---

export default function KelolaPegawai({ auth }) {
    const [pegawaiList, setPegawaiList] = useState(dummyPegawai);
    const [modalState, setModalState] = useState(null);
    const [selectedPegawai, setSelectedPegawai] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 7;

    const filteredPegawai = useMemo(() => {
        return pegawaiList.filter(p =>
            p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nip.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [pegawaiList, searchQuery]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredPegawai.length / ITEMS_PER_PAGE);
        const paginatedData = filteredPegawai.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return { paginatedData, totalPages };
    }, [filteredPegawai, currentPage]);

    const handleOpenModal = (type, pegawai = null) => {
        setSelectedPegawai(pegawai);
        setModalState(type);
    };

    const handleCloseModal = () => setModalState(null);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSave = (data) => {
        if (modalState === 'add') {
            setPegawaiList(prev => [{ ...data, id: Date.now() }, ...prev]);
        } else {
            setPegawaiList(prev => prev.map(p => p.id === data.id ? data : p));
        }
        handleCloseModal();
    };

    const handleDelete = () => {
        if (!selectedPegawai) return;
        setPegawaiList(prev => prev.filter(p => p.id !== selectedPegawai.id));
        handleCloseModal();
    };

    const formatNamaLengkap = (p) => {
        return [p.gelar_depan, p.nama, p.gelar_belakang].filter(Boolean).join(' ');
    }

    return (
        <AdminLayout>
            <Head title="Manajemen Pegawai" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manajemen Pegawai</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus data pegawai.</p>
                </div>
                <button onClick={() => handleOpenModal('add')} className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold">
                    Tambah Pegawai
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <input
                    type="text"
                    placeholder="Cari Nama atau NIP..."
                    value={searchQuery}
                    onChange={e => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset ke halaman 1 saat search
                    }}
                    className="w-full md:w-1/3 mb-4 border-gray-300 rounded-lg"
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">NIP</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Gelar Depan</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Nama Lengkap</th> {/* Hanya nama, tanpa gelar */}
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Gelar Belakang</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Jabatan Struktural</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
    {paginatedData.map(pegawai => (
        <tr key={pegawai.id} className="hover:bg-gray-50">
            {/* Menambahkan text-gray-600 ke setiap sel <td> */}
            <td className="px-6 py-4 text-gray-600">{pegawai.nip}</td>
            <td className="px-6 py-4 text-gray-600">{pegawai.gelar_depan || '-'}</td>
            <td className="px-6 py-4 text-gray-600 font-medium">{pegawai.nama}</td>
            <td className="px-6 py-4 text-gray-600">{pegawai.gelar_belakang || '-'}</td>
            <td className="px-6 py-4 text-gray-600">{pegawai.jabatan_struktural}</td>
            <td className="px-6 py-4 text-gray-600"> {/* Kolom Aksi */}
                <div className="flex items-center space-x-1">
                    <button onClick={() => handleOpenModal('detail', pegawai)} className="p-2 text-sky-600 hover:bg-sky-100 rounded-full" title="Lihat Detail">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => handleOpenModal('edit', pegawai)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-full" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                    </button>
                    <button onClick={() => handleOpenModal('delete', pegawai)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </td>
        </tr>
    ))}
    {/* Baris "Tidak ada pengguna ditemukan" sudah menggunakan text-gray-400, yang merupakan shade gray yang sesuai untuk pesan info */}
    {filteredPegawai.length === 0 && (
        <tr><td colSpan={6} className="text-center py-10 text-gray-400">Tidak ada pengguna ditemukan.</td></tr>
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
            {modalState === 'add' && <PegawaiFormModal onClose={handleCloseModal} onSave={handleSave} pegawai={null} />}
            {modalState === 'edit' && selectedPegawai && <PegawaiFormModal onClose={handleCloseModal} onSave={handleSave} pegawai={selectedPegawai} />}
            {modalState === 'delete' && selectedPegawai && <DeleteConfirmModal onClose={handleCloseModal} onConfirm={handleDelete} pegawai={selectedPegawai} />}
            {modalState === 'detail' && selectedPegawai && <DetailPegawaiModal onClose={handleCloseModal} pegawai={selectedPegawai} />}
        </AdminLayout>
    );
}
