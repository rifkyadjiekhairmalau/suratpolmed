import React, { useState, useMemo, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react"; // Import router for manual visits/post
import AdminLayout from "@/layouts/AdminLayout";
import Swal from "sweetalert2";

export default function Pengguna({
    auth,
    users,
    roleOptions,
    jabatanStrukturalOptions,
    flash,
}) {
    // Pastikan jabatanStrukturalOptions diterima
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("Semua Role");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [editingUser, setEditingUser] = useState(null); // Stores user data when in "edit" mode

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            username: "",
            password: "",
            level_user_id: "",
            jabatan_struktural_id: "",
            // mahasiswa_id dan pegawai_id tidak perlu di state form jika tidak diisi langsung di modal
            // Cukup biarkan backend yang handle relasi polymorph
            status: "aktif", // Default status for new users
        });

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: flash.success,
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

    const filteredUsers = useMemo(() => {
        return users
            .filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    user.username
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
            .filter(
                (user) =>
                    roleFilter === "Semua Role" || user.role === roleFilter
            );
    }, [users, searchQuery, roleFilter]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedData = useMemo(() => {
        return filteredUsers.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredUsers, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        clearErrors(); // Bersihkan error sebelumnya
        if (mode === "add") {
            reset(); // Reset form untuk menambahkan
            // Set default level_user_id ke opsi pertama selain 'Semua Role' jika ada
            setData({
                ...data,
                level_user_id: roleOptions.length > 1 ? roleOptions[1].id : "",
                jabatan_struktural_id: "", // Pastikan kosong saat tambah
            });
        } else if (mode === "edit" && user) {
            setEditingUser(user);
            setData({
                name: user.name,
                username: user.username,
                password: "", // Password harus kosong untuk edit, pengguna bisa memilih untuk mengubahnya
                level_user_id: user.level_user_id,
                jabatan_struktural_id: user.jabatan_struktural_id || "", // Pastikan nilai default jika null
                status: user.status.toLowerCase(), // Pastikan lowercase untuk backend
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === "add") {
            post(route("admin.users.store"), {
                onSuccess: () => {
                    handleCloseModal();
                },
            });
        } else {
            put(route("admin.users.update", editingUser.id), {
                onSuccess: () => {
                    handleCloseModal();
                },
            });
        }
    };

    const handleToggleStatus = (user) => {
        Swal.fire({
            title: `Yakin ingin mengubah status ${user.name}?`,
            text: `Status saat ini: ${user.status}. Akan diubah menjadi ${
                user.status === "Aktif" ? "Nonaktif" : "Aktif"
            }.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Ubah Status!",
            confirmButtonColor: "#d33",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                // Menggunakan router.post karena toggleStatus adalah POST request
                router.post(
                    route("admin.users.toggleStatus", user.id),
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Berhasil!",
                                "Status pengguna berhasil diubah.",
                                "success"
                            );
                        },
                        onError: () => {
                            Swal.fire(
                                "Error!",
                                "Gagal mengubah status pengguna.",
                                "error"
                            );
                        },
                    }
                );
            }
        });
    };

    const generatePageNumbers = () => {
        const pages = [];
        const maxShown = 5;
        let start = Math.max(currentPage - 2, 1);
        let end = Math.min(start + maxShown - 1, totalPages);
        if (end - start < maxShown - 1) {
            start = Math.max(end - maxShown + 1, 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manajemen Pengguna
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Tambah, edit, atau aktifkan/nonaktifkan data pengguna
                        sistem.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => handleOpenModal("add")}
                    className="px-5 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition shadow-sm hover:shadow-md w-full md:w-auto"
                >
                    Tambah Pengguna
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-5 flex flex-col md:flex-row items-center gap-4">
                    <input
                        type="text"
                        placeholder="Cari Nama atau Username..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-auto flex-grow border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-fit border border-gray-300 rounded-xl px-3 py-2.5 min-w-[220px] focus:ring-2 focus:ring-violet-400 text-left"
                    >
                        <option value="Semua Role">Semua Role</option>
                        {roleOptions
                            .filter((opt) => opt.id !== "all")
                            .map(
                                (
                                    role // Filter 'all' option from actual roles
                                ) => (
                                    <option key={role.id} value={role.nama}>
                                        {role.nama}
                                    </option>
                                )
                            )}
                    </select>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="min-w-[1000px] table-auto w-full">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-black-600 uppercase w-[20%]">
                                    Nama
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-black-600 uppercase w-[20%]">
                                    Username
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-black-600 uppercase w-[10%]">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-black-600 uppercase w-[20%]">
                                    Jabatan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-black-600 uppercase w-[5%]">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-black-600 uppercase w-[10%]">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50/50"
                                    >
                                        <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                                            {user.username}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                                            {user.role}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                                            {user.jabatan}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.status === "Aktif"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            "edit",
                                                            user
                                                        )
                                                    }
                                                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-full"
                                                    title="Edit Pengguna"
                                                >
                                                    {/* Edit Icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(user)
                                                    }
                                                    className={`p-2  hover:bg-red-100 rounded-full ${
                                                        user.status === "Aktif"
                                                            ? "text-red-600 hover:underline"
                                                            : "text-green-600 hover:underline"
                                                    }`}
                                                    title={
                                                        user.status === "Aktif"
                                                            ? "Nonaktifkan Pengguna"
                                                            : "Aktifkan Pengguna"
                                                    }
                                                >
                                                    {user.status === "Aktif" ? (
                                                        // Nonaktif Icon (e.g., Circle with cross)
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        // Aktif Icon (e.g., Checkmark in circle)
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-3 text-center text-gray-500"
                                    >
                                        Tidak ada pengguna ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        <nav
                            className="flex items-center gap-2"
                            aria-label="Pagination"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                            >
                                « Prev
                            </button>
                            {generatePageNumbers().map((page) => (
                                <button
                                    type="button"
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                                        currentPage === page
                                            ? "bg-violet-600 text-white"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                    aria-current={
                                        currentPage === page
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                            >
                                Next »
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit User */}
            {isModalOpen && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full mx-4"> {/* DIUBAH: max-w-lg menjadi max-w-xl */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                    {modalMode === "add"
                        ? "Tambah Pengguna Baru"
                        : "Edit Pengguna"}
                </h3>
                <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4"> {/* Menggunakan grid 2 kolom */}
                    {/* Baris 1: Nama Lengkap */}
                    <div className="md:col-span-2 mb-2"> {/* Nama Lengkap akan mengambil 2 kolom penuh */}
                        <label
                            htmlFor="name"
                            className="block text-gray-700 text-sm font-bold mb-1" // Mengurangi mb-2 menjadi mb-1 untuk kerapatan
                        >
                            Nama Lengkap:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs italic">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Baris 2: Username & Password */}
                    <div className="mb-2"> {/* Kolom 1 dari baris 2 */}
                        <label
                            htmlFor="username"
                            className="block text-gray-700 text-sm font-bold mb-1"
                        >
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs italic">
                                {errors.username}
                            </p>
                        )}
                    </div>
                    <div className="mb-2"> {/* Kolom 2 dari baris 2 */}
                        <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-1"
                        >
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Min 8 characters"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required={modalMode === "add"}
                        />
                        {modalMode === "edit" && (
                            <p className="text-gray-500 text-xs mt-1">
                                Biarkan kosong jika tidak ingin mengubah
                                password.
                            </p>
                        )}
                        {errors.password && (
                            <p className="text-red-500 text-xs italic">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Baris 3: Role & Jabatan Struktural */}
                    <div className="mb-2"> {/* Kolom 1 dari baris 3 */}
                        <label
                            htmlFor="level_user_id"
                            className="block text-gray-700 text-sm font-bold mb-1"
                        >
                            Role:
                        </label>
                        <select
                            id="level_user_id"
                            name="level_user_id"
                            value={data.level_user_id}
                            onChange={(e) =>
                                setData("level_user_id", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required
                        >
                            <option value="">Pilih Role</option>
                            {roleOptions
                                .filter((opt) => opt.id !== "all")
                                .map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.id}
                                    >
                                        {role.nama}
                                    </option>
                                ))}
                        </select>
                        {errors.level_user_id && (
                            <p className="text-red-500 text-xs italic">
                                {errors.level_user_id}
                            </p>
                        )}
                    </div>


                    {/* Baris 4: Status */}
                    <div className="md:col-span-1 mb-4"> {/* Status mengambil 2 kolom penuh, mb-4 agar tombol tidak terlalu dekat */}
                        <label
                            htmlFor="status"
                            className="block text-gray-700 text-sm font-bold mb-1"
                        >
                            Status:
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={(e) =>
                                setData("status", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                            required
                        >
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-xs italic">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2 mb-4"> {/* Kolom 2 dari baris 3 */}
                        <label
                            htmlFor="jabatan_struktural_id"
                            className="block text-gray-700 text-sm font-bold mb-1"
                        >
                            Jabatan Struktural (Opsional):
                        </label>
                        <select
                            id="jabatan_struktural_id"
                            name="jabatan_struktural_id"
                            value={data.jabatan_struktural_id}
                            onChange={(e) =>
                                setData(
                                    "jabatan_struktural_id",
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-violet-400"
                        > {/* required dihapus karena opsional */}
                            <option value="">
                                Tidak Ada Jabatan Struktural
                            </option>
                            {jabatanStrukturalOptions.map((jabatan) => (
                                <option
                                    key={jabatan.id}
                                    value={jabatan.id}
                                >
                                    {jabatan.nama_jabatan}
                                </option>
                            ))}
                        </select>
                        {errors.jabatan_struktural_id && (
                            <p className="text-red-500 text-xs italic">
                                {errors.jabatan_struktural_id}
                            </p>
                        )}
                    </div>
                </div> {/* Akhir dari grid */}

                <div className="flex items-center justify-end gap-3 mt-4"> {/* mt-4 untuk jarak dari input terakhir */}
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {processing
                            ? "Menyimpan..."
                            : modalMode === "add"
                            ? "Tambah Pengguna"
                            : "Perbarui Pengguna"}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

        </AdminLayout>
    );
}
