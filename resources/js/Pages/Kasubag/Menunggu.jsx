import React, { useState, useEffect, useMemo } from "react";
import KasubagLayout from "@/Layouts/KasubagLayout";
import { Head, usePage } from "@inertiajs/react";
import KasubagModal from "./KasubagModal";
import { message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

// --- Helper Components ---
const StatusTag = ({ status }) => {
    const lowerCaseStatus = status?.toLowerCase() || "";
    const isSelesai = lowerCaseStatus.includes("selesai");
    const isDikembalikan = lowerCaseStatus.includes("dikembalikan");
    const isMenunggu = lowerCaseStatus.includes("menunggu") || lowerCaseStatus.includes("proses");
    let tagClasses = "px-2 py-1 text-xs font-medium rounded-md inline-block";
    if (isSelesai) tagClasses += " bg-green-100 text-green-800";
    else if (isDikembalikan) tagClasses += " bg-red-100 text-red-800";
    else if (isMenunggu) tagClasses += " bg-blue-100 text-blue-800";
    else tagClasses += " bg-gray-100 text-gray-800";
    return <span className={tagClasses}>{status || "N/A"}</span>;
};

// [PERUBAHAN]: Komponen Paginasi disederhanakan agar sesuai gambar
const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                « Prev
            </button>

            {/* Tombol Angka Halaman */}
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                Next »
            </button>
        </div>
    );
};


// --- Komponen Utama ---
export default function Menunggu({ auth, suratMenunggu }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // [PERUBAHAN]: Pengaturan jumlah baris per halaman (PAGE_LIST)
    // Anda bisa mengubah angka ini sesuai kebutuhan.
    const ITEMS_PER_PAGE = 8;

    // Logika paginasi
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = suratMenunggu.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setCurrentPage(1);
    }, [suratMenunggu]);

    useEffect(() => {
        if (flash.success) message.success(flash.success);
        if (flash.error) message.error(flash.error);
    }, [flash]);

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
            <Head title="Menunggu Tindak Lanjut" />
            <div className="py-0.5">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-25 w-full">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Surat Menunggu Tindak Lanjut
                        </h1>

                        <table className="min-w-full w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-purple-100">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[13%]">No. Agenda</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[24%]">Perihal</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[18%]">Pengaju</th>
                                    {/* <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[14%]">Diterima Dari</th> */}
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[13%]">Tanggal Diterima</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider w-[22%]">Status</th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-black uppercase tracking-wider w-[10%]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((surat) => (
                                        <tr key={surat.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900 break-words">{surat.nomor_agenda}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">{surat.perihal}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">{surat.pengaju?.name}</td>
                                            {/* <td className="px-4 py-4 text-sm text-gray-600 break-words">{surat.tracking[1]?.dariUser?.name || "N/A"}</td> */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{dayjs(surat.latest_tracking?.created_at).format("DD MMMM YYYY")}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 break-words">
                                                <StatusTag status={surat.latest_tracking?.status?.nama_status} />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => openModal(surat)} className="px-4 py-2 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md transition-colors duration-200" aria-label="Tindak Lanjut">
                                                    Tindak Lanjut
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            Tidak ada surat yang perlu ditindaklanjuti.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* [PERUBAHAN]: Wrapper paginasi disederhanakan */}
                        <div className="p-4 flex items-center justify-center">
                            <Pagination totalItems={suratMenunggu.length} itemsPerPage={ITEMS_PER_PAGE} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </div>
                </div>
            </div>

            <KasubagModal show={isModalOpen} onClose={closeModal} surat={selectedSurat} />
        </KasubagLayout>
    );
}
