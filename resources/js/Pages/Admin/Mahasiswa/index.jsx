import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

// =======================================================================
// 1. SETUP DUMMY DATA (TIPE DATA DIHAPUS)
// =======================================================================

const PRODI_OPTIONS = [
    'Teknik Komputer',
    'Manajemen Informatika',
    'Teknik Mesin',
    'Teknik Sipil',
    'Akuntansi',
    'Administrasi Bisnis',
];

const dummyMahasiswa = [
    { id: 1, nim: '230501001', nama: 'Budi Santoso', email: 'budi.s@example.com', prodi: 'Teknik Komputer' },
    { id: 2, nim: '230502002', nama: 'Citra Dewi', email: 'citra.d@example.com', prodi: 'Manajemen Informatika' },
    { id: 3, nim: '230503003', nama: 'Eka Putra', email: 'eka.p@example.com', prodi: 'Teknik Mesin' },
    { id: 4, nim: '230501004', nama: 'Fajar Nugroho', email: 'fajar.n@example.com', prodi: 'Teknik Komputer' },
    { id: 5, nim: '230505005', nama: 'Gita Amelia', email: 'gita.a@example.com', prodi: 'Akuntansi' },
    { id: 6, nim: '230506006', nama: 'Hendra Wijaya', email: 'hendra.w@example.com', prodi: 'Administrasi Bisnis' },
    { id: 7, nim: '230504007', nama: 'Indah Permata', email: 'indah.p@example.com', prodi: 'Teknik Sipil' },
    { id: 8, nim: '230501008', nama: 'Joko Susilo', email: 'joko.s@example.com', prodi: 'Teknik Komputer' },
    { id: 9, nim: '230502009', nama: 'Kartika Sari', email: 'kartika.s@example.com', prodi: 'Manajemen Informatika' },
    { id: 10, nim: '230505010', nama: 'Lina Marlina', email: 'lina.m@example.com', prodi: 'Akuntansi' },
    { id: 11, nim: '230503011', nama: 'Muhammad Zaki', email: 'muhammad.z@example.com', prodi: 'Teknik Mesin' },
    { id: 12, nim: '230501012', nama: 'Nina Lestari', email: 'nina.l@example.com', prodi: 'Teknik Komputer' },
];

// =======================================================================
// 2. KOMPONEN-KOMPONEN MODAL (TIPE DATA DIUBAH)
// =======================================================================

const MahasiswaFormModal = ({ mahasiswa, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        mahasiswa || { nim: '', nama: '', email: '', prodi: PRODI_OPTIONS[0] }
    );
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nim || !formData.nama || !formData.email || !formData.prodi) {
            alert('Semua field harus diisi!');
            return;
        }
        const dataToSave = { ...formData, id: formData.id || Date.now() };
        onSave(dataToSave);
    };
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border-t-4 border-violet-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{mahasiswa ? 'Edit Mahasiswa' : 'Tambah Mahasiswa Baru'}</h2>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">NIM</label><input type="text" name="nim" value={formData.nim} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label><select name="prodi" value={formData.prodi} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400">{PRODI_OPTIONS.map(prodi => <option key={prodi} value={prodi}>{prodi}</option>)}</select></div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">Batal</button>
                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition">Simpan</button>
                </div>
            </form>
        </div>
    );
};

const DeleteConfirmModal = ({ mahasiswa, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600">Anda yakin ingin menghapus data mahasiswa <strong className="font-semibold">{mahasiswa.nama}</strong> ({mahasiswa.nim})?</p>
            <div className="flex justify-end gap-4 mt-8">
                <button onClick={onClose} className="px-6 py-2 border rounded-lg">Batal</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Ya, Hapus</button>
            </div>
        </div>
    </div>
);

// =======================================================================
// PERUBAHAN: Komponen Pagination Diubah Sesuai Gambar (TIPE DATA DIUBAH)
// =======================================================================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <nav className="flex items-center justify-center md:justify-center gap-4 mt-6" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                &laquo; Prev
            </button>

            <div className="flex items-center gap-2">
                {[...Array(totalPages).keys()].map(num => (
                    <button
                        key={num + 1}
                        onClick={() => onPageChange(num + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                            currentPage === num + 1
                                ? 'bg-violet-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                        aria-current={currentPage === num + 1 ? 'page' : undefined}
                    >
                        {num + 1}
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


// =======================================================================
// 3. KOMPONEN HALAMAN UTAMA (TIPE DATA DIUBAH)
// =======================================================================
export default function KelolaMahasiswa({ auth }) {
    const [mahasiswaList, setMahasiswaList] = useState(dummyMahasiswa);
    const [modalState, setModalState] = useState(null);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 7;

    const filteredMahasiswa = useMemo(() => {
        return mahasiswaList.filter(mhs =>
            mhs.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mhs.nim.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [mahasiswaList, searchQuery]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredMahasiswa.length / ITEMS_PER_PAGE);
        const paginatedData = filteredMahasiswa.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return { paginatedData, totalPages };
    }, [filteredMahasiswa, currentPage]);

    const handleOpenModal = (type, mahasiswa = null) => {
        setSelectedMahasiswa(mahasiswa);
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
            setMahasiswaList(prev => [{ ...data, id: Date.now() }, ...prev]);
        } else {
            setMahasiswaList(prev => prev.map(mhs => mhs.id === data.id ? data : mhs));
        }
        handleCloseModal();
    };

    const handleDelete = () => {
        if (!selectedMahasiswa) return;
        setMahasiswaList(prev => prev.filter(mhs => mhs.id !== selectedMahasiswa.id));
        handleCloseModal();
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Akun Mahasiswa" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manajemen Akun Mahasiswa</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus data akun mahasiswa.</p>
                </div>
                <button onClick={() => handleOpenModal('add')} className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition shadow-sm">
                    Tambah Mahasiswa
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari Nama atau NIM..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">NIM</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Prodi</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map(mhs => (
                                <tr key={mhs.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-gray-600">{mhs.nim}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{mhs.nama}</td>
                                    <td className="px-6 py-4 text-gray-600">{mhs.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{mhs.prodi}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleOpenModal('edit', mhs)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                            <button onClick={() => handleOpenModal('delete', mhs)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Hapus"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMahasiswa.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Data mahasiswa tidak ditemukan.</td></tr>
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

            {/* Render Modals (tidak diubah) */}
            {modalState === 'add' && <MahasiswaFormModal onClose={handleCloseModal} onSave={handleSave} mahasiswa={null} />}
            {modalState === 'edit' && selectedMahasiswa && <MahasiswaFormModal onClose={handleCloseModal} onSave={handleSave} mahasiswa={selectedMahasiswa} />}
            {modalState === 'delete' && selectedMahasiswa && <DeleteConfirmModal onClose={handleCloseModal} onConfirm={handleDelete} mahasiswa={selectedMahasiswa} />}
        </AdminLayout>
    );
}
