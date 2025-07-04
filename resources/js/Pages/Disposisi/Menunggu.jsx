import React, { useState, useEffect } from "react";
import DisposisiLayout from "@/Layouts/DisposisiLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DisposisiModal from "./DisposisiModal";
// import { message } from "antd"; // Menggunakan message dari antd untuk notifikasi yang lebih baik
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

// --- Helper Components ---

// Komponen StatusTag yang menggunakan logika pewarnaan dari kode Anda
const StatusTag = ({ status }) => {
    const getStatusBadgeClass = (statusText) => {
        if (!statusText) return "bg-gray-100 text-gray-800";
        const lowerStatus = statusText.toLowerCase();
        if (lowerStatus.includes("selesai"))
            return "bg-green-100 text-green-800";
        if (
            lowerStatus.includes("dikembalikan") ||
            lowerStatus.includes("ditolak")
        )
            return "bg-red-100 text-red-800";
        if (lowerStatus.includes("menunggu disposisi"))
            return "bg-blue-100 text-blue-800";
        return "bg-blue-100 text-blue-800"; // Default untuk status proses/menunggu lainnya
    };

    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-md inline-block ${getStatusBadgeClass(
                status
            )}`}
        >
            {status}
        </span>
    );
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
// Komponen Paginasi kustom dari halaman sebelumnya
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
export default function Menunggu({
    auth,
    suratMenunggu,
    tujuanDisposisi,
    catatanDisposisi,
}) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Pengaturan jumlah baris per halaman
    const ITEMS_PER_PAGE = 5;

    // useEffect(() => {
    //     if (flash.success) {
    //         message.success(flash.success); // Mengganti alert dengan notifikasi Antd
    //     }
    //     if (flash.error) {
    //         message.error(flash.error);
    //     }
    // }, [flash]);

    // Logika paginasi
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = suratMenunggu.slice(indexOfFirstItem, indexOfLastItem);

    const openDisposisiModal = (surat) => {
        setSelectedSurat(surat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSurat(null);
        router.reload({ only: ["suratMenunggu"], preserveScroll: true });
    };

    return (
        <DisposisiLayout user={auth.user}>
            <Head title="Surat Menunggu Disposisi" />
            <div className="py-0.5">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-25 w-full">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Surat Menunggu Disposisi Saya
                        </h1>

                        <table className="min-w-full w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-purple-100">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[13%]"
                                    >
                                        No. Agenda
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[30%]"
                                    >
                                        Perihal
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[20%]"
                                    >
                                        Pengaju
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[28%]"
                                    >
                                        Status Terkini
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider w-[9%]"
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
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900 break-words">
                                                {surat.nomor_agenda}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                {surat.perihal}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                {surat.pengaju?.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                <StatusTag
                                                    status={
                                                        surat.tracking[0]
                                                            ?.status
                                                            ?.nama_status ||
                                                        "Menunggu"
                                                    }
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
    onClick={() =>
        openDisposisiModal(
            surat
        )
    }
    className="px-2 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md transition-colors duration-200"
    aria-label="Disposisi"
>
    Disposisi
</button>
                                                {/* <button
                                                    onClick={() =>
                                                        openDisposisiModal(
                                                            surat
                                                        )
                                                    }
                                                    className="p-2 text-violet-600 hover:bg-violet-100 rounded-full transition-colors duration-200"
                                                    aria-label="Lihat Detail"
                                                >
                                                    <EyeIcon />
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            Tidak ada surat yang menunggu
                                            disposisi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="p-4 flex items-center justify-center">
                            <Pagination
                                totalItems={suratMenunggu.length}
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
                tujuanDisposisi={tujuanDisposisi}
                catatanDisposisi={catatanDisposisi}
                isReadOnly={false}
            />
        </DisposisiLayout>
    );
}
