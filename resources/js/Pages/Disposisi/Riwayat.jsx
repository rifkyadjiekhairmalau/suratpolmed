import React, { useState, useEffect, useMemo } from "react";
import DisposisiLayout from "@/Layouts/DisposisiLayout";
import { Head, usePage } from "@inertiajs/react";
import DisposisiModal from "./DisposisiModal";
// import { message } from "antd";
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

// --- Helper Components (Tidak ada perubahan) ---
const StatusTag = ({ status }) => {
    const lowerCaseStatus = status?.toLowerCase() || "";
    const isSelesai = lowerCaseStatus.includes("selesai");
    const isDikembalikan = lowerCaseStatus.includes("dikembalikan");
    const isMenunggu = lowerCaseStatus.includes("menunggu");
    let tagClasses = "px-2 py-1 text-xs font-medium rounded-md inline-block";
    if (isSelesai) tagClasses += " bg-green-100 text-green-800";
    else if (isDikembalikan) tagClasses += " bg-red-100 text-red-800";
    else if (isMenunggu) tagClasses += " bg-blue-100 text-blue-800";
    else tagClasses += " bg-gray-100 text-gray-800";
    return <span className={tagClasses}>{status || "N/A"}</span>;
};
const EyeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.012 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
        />
    </svg>
);
const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
}) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    return (
        <div className="flex items-center justify-center mt-4">
            <nav
                className="flex items-center justify-center space-x-2"
                aria-label="Pagination"
            >
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                    « Prev
                </button>
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                            currentPage === number
                                ? "bg-violet-600 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:text-violet-600"
                        }`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                   Next »
                </button>
            </nav>
        </div>
    );
};

// --- Komponen Utama ---
export default function Riwayat({ auth, suratSudahDisposisi }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 3;

    const filteredData = useMemo(() => {
        return suratSudahDisposisi
            .filter((surat) => {
                if (statusFilter === "") return true;
                const status = (
                    surat.latest_tracking?.status?.nama_status || "Selesai"
                ).toLowerCase();
                return status.includes(statusFilter);
            })

            .filter((surat) => { // Filter berdasarkan Teks Pencarian
            const search = searchTerm.toLowerCase();

            // --- PERUBAHAN DI SINI ---
            // 1. Format tanggal disposisi menjadi teks
            const tanggalDisposisi = surat.disposisi[0]?.created_at;
            const tanggalFormatted = tanggalDisposisi
                ? dayjs(tanggalDisposisi).format("DD MMMM YYYY").toLowerCase()
                : "";

            // 2. Tambahkan 'tanggalFormatted' ke dalam kondisi pencarian
            return (
                surat.perihal.toLowerCase().includes(search) ||
                surat.nomor_agenda.toLowerCase().includes(search) ||
                tanggalFormatted.includes(search)
            );
            });
    }, [suratSudahDisposisi, searchTerm, statusFilter]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);
    useEffect(() => {
        if (flash && flash.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil Disposisi!",
                        text: flash.success,
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }
        if (flash && flash.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Terjadi Kesalahan!",
                        text: flash.error,
                    });
                }
    }, [flash]);
    const openDetailModal = (surat) => {
        setSelectedSurat(surat);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSurat(null);
    };

    return (
        <DisposisiLayout user={auth.user}>
            <Head title="Riwayat Disposisi" />
            <div className="py-0.5">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-25 w-full">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden p-6">
                        <h2 className="text-2xl font-bold mb-2">
                            Surat Yang Telah Saya Disposisi
                        </h2>
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Cari Perihal / No. Agenda / Tanggal Disposisi"
                                className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* [PERUBAHAN]: Select dilebarkan dengan 'w-48' */}
                            <select
                                className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="">Semua Status</option>
                                <option value="selesai">Selesai</option>
                                <option value="dikembalikan">
                                    Dikembalikan
                                </option>
                                <option value="menunggu">Menunggu</option>
                            </select>
                        </div>

                        <table className="min-w-full w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-purple-100">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[10%]"
                                    >
                                        No. Agenda
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[23%]"
                                    >
                                        Perihal
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[20%]"
                                    >
                                        Pengaju
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[11%]"
                                    >
                                        Tanggal Disposisi
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[28%]"
                                    >
                                        Status Terkini
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider w-[8%]"
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((surat) => (
                                        <tr
                                            key={surat.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words">
                                                {surat.nomor_agenda}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 break-words">
                                                {surat.perihal}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 break-words">
                                                {surat.pengaju?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {dayjs(
                                                    surat.disposisi[0]
                                                        ?.created_at
                                                ).format("DD MMMM YYYY")}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 break-words">
                                                <StatusTag
                                                    status={
                                                        surat.latest_tracking
                                                            ?.status
                                                            ?.nama_status ||
                                                        "Selesai"
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        openDetailModal(surat)
                                                    }
                                                    className="p-2 text-violet-600 hover:bg-violet-100 rounded-full transition-colors duration-200"
                                                    aria-label="Lihat Detail"
                                                >
                                                    <EyeIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            Tidak ada data yang cocok dengan
                                            filter Anda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="p-4">
                            <Pagination
                                totalItems={filteredData.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DisposisiModal
                show={isModalOpen}
                onClose={closeModal}
                surat={selectedSurat}
                isReadOnly={true}
            />
        </DisposisiLayout>
    );
}
