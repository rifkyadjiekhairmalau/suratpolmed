import React, { useState, useEffect } from "react";
import KasubagLayout from "@/Layouts/KasubagLayout";
import { Head, usePage } from "@inertiajs/react";
import KasubagModal from "./KasubagModal";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

// --- Helper Components ---
const StatusTag = ({ status }) => {
    const lowerCaseStatus = status?.toLowerCase() || "";
    const isSelesai = lowerCaseStatus.includes("selesai");
    const isDikembalikan = lowerCaseStatus.includes("dikembalikan");
    const isMenunggu =
        lowerCaseStatus.includes("menunggu") ||
        lowerCaseStatus.includes("proses");
    let tagClasses = "px-2 py-1 text-xs font-medium rounded-md inline-block";
    if (isSelesai) tagClasses += " bg-green-100 text-green-800";
    else if (isDikembalikan) tagClasses += " bg-red-100 text-red-800";
    else if (isMenunggu) tagClasses += " bg-yellow-100 text-yellow-800";
    else tagClasses += " bg-gray-100 text-gray-800";
    return <span className={tagClasses}>{status || "N/A"}</span>;
};

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
        <div className="flex items-center justify-center space-x-2">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                « Prev
            </button>

            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105
                            ${
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
        </div>
    );
};

// --- Komponen Utama ---
export default function Riwayat({ auth, suratSudahTindakLanjut }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const ITEMS_PER_PAGE = 5;

    // 1. Filter data berdasarkan searchTerm sebelum dipaginasi
    const filteredItems = suratSudahTindakLanjut.filter((surat) => {
    const search = searchTerm.toLowerCase();

    // Ambil dan format tanggal selesai menjadi teks
    const tanggalSelesai = surat.latest_tracking?.created_at;
    const tanggalFormatted = tanggalSelesai
        ? dayjs(tanggalSelesai).format("DD MMMM YYYY").toLowerCase()
        : "";

    // Kembalikan true jika salah satu kondisi terpenuhi
    return (
        surat.perihal?.toLowerCase().includes(search) ||
        surat.nomor_agenda?.toLowerCase().includes(search) ||
        tanggalFormatted.includes(search) // <-- Tambahkan pencarian tanggal di sini
    );
});

    // 2. Lakukan paginasi pada data yang SUDAH difilter
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    useEffect(() => {
        if (flash && flash.success) {
            Swal.fire({
                icon: "success",
                title: "Berhasil Tindak Lanjut!",
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

    // 3. Reset halaman ke 1 setiap kali filter pencarian berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const openModal = (surat) => {
        setSelectedSurat(surat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSurat(null);
    };

    return (
        <KasubagLayout user={auth.user}>
            <Head title="Riwayat Tindak Lanjut" />
            <div className="py-0.5">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-25 w-full">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Surat yang Telah Saya Tindak Lanjut
                        </h1>
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Cari Perihal / No. Agenda / Tanggal Selesai"
                                className="w-full max-w-xl px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <table className="min-w-full w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-purple-100">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[12%]">No. Agenda</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[33%]">Perihal</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[20%]">Pengaju</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[15%]">Tanggal Selesai</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[10%]">Status Terkini</th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider w-[5%]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((surat) => (
                                        <tr
                                            key={surat.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900 break-words">
                                                {surat.nomor_agenda}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                {surat.perihal}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                {surat.pengaju?.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {dayjs(
                                                    surat.latest_tracking
                                                        ?.created_at
                                                ).format("DD MMMM YYYY")}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                <StatusTag status="Selesai" />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        openModal(surat)
                                                    }
                                                    className="p-2 text-violet-600 hover:bg-violet-100 rounded-full transition-colors duration-200"
                                                    aria-label="Lihat Detail"
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
                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.012 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
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
                                            Tidak ada surat yang cocok dengan pencarian Anda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="p-4 flex items-center justify-center">
                            <Pagination
                                // 4. Gunakan panjang data yang sudah difilter untuk total item
                                totalItems={filteredItems.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <KasubagModal
                show={isModalOpen}
                onClose={closeModal}
                surat={selectedSurat}
                isReadOnly={true}
            />
        </KasubagLayout>
    );
}
