import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

// =======================================================================
// 1. SETUP DUMMY DATA (TIPE DATA DIHAPUS)
// =======================================================================
const ROLE_OPTIONS = [
    'Semua Role', 'Direktur', 'Wadir', 'Kabag' , 'Kasubbag', 'Pegawai', 'Mahasiswa', 'Administrator'
];

const JABATAN_OPTIONS = [
    'Direktur', 'Wadir Bid. Akademik', 'Wadir Bid. PKU', 'Wadir Bid. Kemahasiswaan',
    'Wadir Bid. Kerjasama', 'Kabag PKU', 'Kabag AKK', 'Kasubbag Umum',
    'Kasubbag Akademik', 'Staf Administrasi', 'Dosen', 'Mahasiswa'
];

const dummyUsers = [
    { id: 1, name: 'Budi Santoso', username: 'budi.s', email: 'budi.santoso@polmed.ac.id', role: 'Mahasiswa', jabatan: 'Mahasiswa', status: 'Aktif' },
    { id: 2, name: 'Dewi Lestari', username: 'dewi.l', email: 'dewi.lestari@polmed.ac.id', role: 'Pegawai', jabatan: 'Staf Administrasi', status: 'Aktif' },
    { id: 3, name: 'Admin Utama', username: 'admin', email: 'admin@polmed.ac.id', role: 'Administrator', jabatan: 'Staf IT', status: 'Aktif' },
    { id: 4, name: 'Gatot Subroto', username: 'gatot.s', email: 'gatot.subroto@polmed.ac.id', role: 'Direktur', jabatan: 'Direktur', status: 'Aktif' },
    { id: 5, name: 'Hana Yuliana', username: 'hana.y', email: 'hana.yuliana@polmed.ac.id', role: 'Wadir', jabatan: 'Wadir Bid. Akademik', status: 'Aktif' },
    { id: 6, name: 'Eko Prasetyo', username: 'eko.p', email: 'eko.prasetyo@polmed.ac.id', role: 'Kasubbag', jabatan: 'Kasubbag Umum', status: 'Nonaktif' },
    { id: 7, name: 'Indra Gunawan', username: 'indra.g', email: 'indra.gunawan@polmed.ac.id', role: 'Mahasiswa', jabatan: 'Mahasiswa', status: 'Nonaktif' },
    { id: 8, name: 'Luhut Panjaitan', username: 'luhut.p', email: 'luhut.panjaitan@polmed.ac.id', role: 'Kasubbag', jabatan: 'Kasubbag Akademik', status: 'Aktif' },
];

// =======================================================================
// 2. KOMPONEN MODAL (TIPE DATA DIHAPUS)
// =======================================================================
const UserFormModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        user || { name: '', username: '', password: '', role: 'Mahasiswa', jabatan: 'Mahasiswa', status: 'Aktif', email: '' }
    );

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target;
            setFormData(prev => ({ ...prev, [name]: checked ? 'Aktif' : 'Nonaktif' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username || !formData.role || !formData.jabatan || (!user && !formData.password)) {
            alert("Harap isi semua field yang wajib diisi!");
            return;
        }
        const userToSave = { ...formData, id: formData.id || Date.now() };
        onSave(userToSave);
    };

    const inputStyle = "w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 md:p-8 relative border-t-4 border-violet-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{user ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className={inputStyle} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" onChange={handleChange} className={inputStyle} placeholder={user ? "Kosongkan jika tidak diubah" : ""} required={!user} />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
                                {ROLE_OPTIONS.filter(r => r !== 'Semua Role').map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                            <select name="jabatan" value={formData.jabatan} onChange={handleChange} className={inputStyle}>
                                {JABATAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Akun</label>
                        <label className="inline-flex items-center mt-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" name="status" checked={formData.status === "Aktif"} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"/>
                            <span className="ml-3 text-gray-700">Akun Aktif</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition">Batal</button>
                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition shadow-sm hover:shadow-md">Simpan Pengguna</button>
                </div>
            </form>
        </div>
    );
};

// =======================================================================
// 3. KOMPONEN HALAMAN UTAMA (TIPE DATA DIHAPUS)
// =======================================================================
export default function Pengguna({ auth }) {
    const [users, setUsers] = useState(dummyUsers);
    const [modalState, setModalState] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua Role');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 7; // Dibuat lebih sedikit agar pagination muncul

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.username.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(user => roleFilter === 'Semua Role' || user.role === roleFilter);
    }, [users, searchQuery, roleFilter]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
        const paginatedData = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return { paginatedData, totalPages };
    }, [filteredUsers, currentPage]);

    const handleOpenModal = (type, user = null) => {
        setSelectedUser(user);
        setModalState(type);
    };

    const handleCloseModal = () => setModalState(null);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSaveUser = (userToSave) => {
        if (modalState === 'add') {
            setUsers(prev => [userToSave, ...prev]);
        } else {
            // Hapus password jika tidak diisi saat edit
            if (!userToSave.password) {
                const { password, ...rest } = userToSave;
                setUsers(prev => prev.map(u => u.id === rest.id ? { ...u, ...rest } : u));
            } else {
                setUsers(prev => prev.map(u => u.id === userToSave.id ? userToSave : u));
            }
        }
        handleCloseModal();
    };

    const handleToggleStatus = (userId) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, status: user.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : user
            )
        );
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau aktifkan/nonaktifkan data pengguna sistem.</p>
                </div>
                <button onClick={() => handleOpenModal('add')} className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition shadow-sm hover:shadow-md">
                    Tambah Pengguna Baru
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {/* Perbaikan di sini: Membuat input pencarian dan select filter role lebih responsif dan estetik */}
                <div className="mb-5 flex flex-col md:flex-row items-center gap-4"> {/* Mengubah gap dari 5 menjadi 4 dan menambah items-center */}
                    <input
                        type="text"
                        placeholder="Cari Nama atau Username..."
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full md:w-auto flex-grow border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400" // w-auto dan flex-grow untuk lebar responsif
                    />
                    <select
    value={roleFilter}
    onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
    // Perubahan di sini: Menggunakan px-4 py-2.5 dan menambah min-w-[150px]
    className="w-full md:w-fit border border-gray-300 rounded-lg px-4 py-2.5 min-w-[150px] focus:ring-2 focus:ring-violet-400"
>
    {ROLE_OPTIONS.map(role => <option key={role} value={role}>{role}</option>)}
</select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Nama</th> {/* Mengganti text-black-600 menjadi text-black-600 */}
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Jabatan</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-gray-600 ">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.username}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.role}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.jabatan}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleOpenModal('edit', user)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit Pengguna">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                            {user.status === 'Aktif' ? (
                                                <button onClick={() => handleToggleStatus(user.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Nonaktifkan Akun">
                                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                                </button>
                                            ) : (
                                                <button onClick={() => handleToggleStatus(user.id)} className="p-2 text-green-600 hover:bg-green-100 rounded-full" title="Aktifkan Akun">
                                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Tidak ada pengguna ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        <nav className="flex items-center gap-2" aria-label="Pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-gray-500 hover:text-violet-700 disabled:text-gray-300">« Prev</button>
                            {[...Array(totalPages).keys()].map(num => (
                                <button key={num + 1} onClick={() => handlePageChange(num + 1)} className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold ${currentPage === num + 1 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                    {num + 1}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-gray-500 hover:text-violet-700 disabled:text-gray-300">Next »</button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modalState === 'add' && <UserFormModal onClose={handleCloseModal} onSave={handleSaveUser} user={null} />}
            {modalState === 'edit' && selectedUser && <UserFormModal onClose={handleCloseModal} onSave={handleSaveUser} user={selectedUser} />}
        </AdminLayout>
    );
}
