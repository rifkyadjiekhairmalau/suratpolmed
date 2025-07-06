import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import BagianUmumLayout from "@/layouts/BagianUmumLayout";
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

// Daftar status untuk dropdown filter
const STATUS_OPTIONS = [
    "Semua Status",
    "Menunggu Disposisi",
    "Didisposisikan",
    "Diproses",
    "Selesai",
    "Diarsipkan",
];

// =======================================================================
// HELPER COMPONENTS UNTUK MODAL BARU
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
        if (lowerStatus.includes("selesai"))
            return <CheckCircleOutlined className="text-green-500" />;
        if (
            lowerStatus.includes("dikembalikan") ||
            lowerStatus.includes("ditolak")
        )
            return <CloseCircleOutlined className="text-red-500" />;
        if (
            lowerStatus.includes("disposisi") ||
            lowerStatus.includes("tindak lanjut") ||
            lowerStatus.includes("proses")
        )
            return <ArrowRightOutlined className="text-blue-500" />;
        if (lowerStatus.includes("verifikasi"))
            return <ClockCircleOutlined className="text-yellow-500" />;
        return <MailOutlined className="text-gray-500" />;
    };

    return (
        <div className="relative flex pb-8">
            {!isLast && (
                <div className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"></div>
            )}
            <div className="relative flex h-10 w-10 flex-none items-center justify-center bg-white">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg ring-8 ring-white">
                    {getIcon(item.status)}
                </div>
            </div>
            <div className="flex-grow pl-4">
                <p className="text-sm font-medium text-gray-800">
                    {item.status}
                </p>
                <p className="text-sm text-gray-500">
                    {dayjs(item.tanggal).format("DD MMM YYYY, HH:mm")}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Oleh: {item.aksi_oleh}
                </p>
                {item.catatan && (
                    <p className="mt-2 text-xs italic bg-yellow-100 border border-yellow-200 text-yellow-800 p-2 rounded-md">
                        "{item.catatan}"
                    </p>
                )}
            </div>
        </div>
    );
};

// [PERUBAHAN]: Komponen Modal untuk menampilkan detail surat
const DetailModal = ({ surat, onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-gray-200">
            <header className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    Detail Surat: {surat.perihal}
                </h2>
            </header>

            <div className="overflow-y-auto p-6 space-y-8">
                {/* BAGIAN 1: INFORMASI SURAT */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                        Informasi Surat
                    </h3>
                    <dl>
                        <DetailItem label="No. Agenda">
                            {surat.no_agenda}
                        </DetailItem>
                        <DetailItem label="Perihal">{surat.perihal}</DetailItem>
                        <DetailItem label="Pengaju">{surat.pengaju}</DetailItem>
                        <DetailItem label="Ditujukan Kepada">
                            {surat.ditujukan_kepada}
                        </DetailItem>
                        <DetailItem label="Jenis Surat">
                            {surat.jenis_surat}
                        </DetailItem>
                        <DetailItem label="Tgl. Pengajuan">
                            {dayjs(surat.tgl_pengajuan).format("DD MMMM YYYY")}
                        </DetailItem>
                        <DetailItem label="Urgensi">
                            <span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                {surat.urgensi}
                            </span>
                        </DetailItem>
                        <DetailItem label="File Surat">
                            <a
                                href={surat.file_surat}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline inline-flex items-center"
                            >
                                <FileTextOutlined className="mr-2" /> Lihat File
                            </a>
                        </DetailItem>
                    </dl>
                    <div className="mt-5">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Isi Surat / Keterangan
                        </h4>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 max-h-32 text-sm overflow-y-auto whitespace-pre-wrap">
                            {surat.isi_surat || "Tidak ada isi surat."}
                        </div>
                    </div>
                </section>

                {/* BAGIAN 2: RIWAYAT TRACKING */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Riwayat Tracking
                    </h3>
                    <div className="flow-root">
                        {(surat.tracking_history || []).length > 0 ? (
                            (surat.tracking_history || []).map(
                                (item, index) => (
                                    <TrackingItem
                                        key={index}
                                        item={item}
                                        isLast={
                                            index ===
                                            surat.tracking_history.length - 1
                                        }
                                    />
                                )
                            )
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Belum ada riwayat tracking.
                            </p>
                        )}
                    </div>
                </section>
            </div>
            <footer className="p-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white rounded-b-2xl z-10">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold transition"
                >
                    Tutup
                </button>
            </footer>
        </div>
    </div>
);

// =======================================================================
// KOMPONEN UTAMA HALAMAN (TIDAK ADA PERUBAHAN FUNGSI)
// =======================================================================
export default function Terverifikasi({ auth, daftarSurat }) {
    const [semuaSurat] = useState(daftarSurat);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua Status");
    const [selectedSurat, setSelectedSurat] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const filteredSurat = useMemo(() => {
        return semuaSurat
            .filter(
                (surat) =>
                    (surat.perihal || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (surat.no_agenda || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
            .filter(
                (surat) =>
                    statusFilter === "Semua Status" ||
                    (surat.status_terkini || "").includes(statusFilter)
            );
    }, [semuaSurat, searchQuery, statusFilter]);

    const { paginatedData, totalPages } = useMemo(() => {
        const totalPages = Math.ceil(filteredSurat.length / ITEMS_PER_PAGE);
        const paginatedData = filteredSurat.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
        return { paginatedData, totalPages };
    }, [filteredSurat, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getStatusBadgeClass = (status) => {
        if (!status) return "bg-gray-100 text-gray-800";
        const s = status.toLowerCase();
        if (s.includes("menunggu")) return "bg-blue-100 text-blue-800";
        if (s.includes("selesai")) return "bg-green-100 text-green-800";
        if (s.includes("disposisi")) return "bg-blue-100 text-blue-800";
        if (s.includes("dikembalikan") || s.includes("ditolak"))
            return "bg-red-100 text-red-800";
        if (s.includes("diproses")) return "bg-cyan-100 text-cyan-800";
        return "bg-gray-100 text-gray-800";
    };

    // Komponen Pagination dipindah ke sini agar tidak error
    const Pagination = ({ currentPage, totalPages, onPageChange }) => (
        <div className="flex justify-center items-center mt-8">
            <nav className="flex items-center gap-2" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-violet-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                    &laquo; Prev
                </button>
                <div className="flex items-center gap-2">
                    {[...Array(totalPages).keys()].map((num) => (
                        <button
                            key={num + 1}
                            onClick={() => onPageChange(num + 1)}
                            className={`w-10 h-10 flex items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                                currentPage === num + 1
                                    ? "bg-violet-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:text-violet-600"
                            }`}
                            aria-current={
                                currentPage === num + 1 ? "page" : undefined
                            }
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
        </div>
    );

    return (
        <BagianUmumLayout user={auth.user}>
            <Head title="Surat Masuk Terverifikasi" />
            <main className="min-h-screen bg-gray-50 p-2 md:p-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                        Surat Masuk Terverifikasi
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Daftar seluruh surat masuk yang telah diverifikasi.
                    </p>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                            <div className="relative w-full md:w-auto flex-grow">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari Perihal atau No. Agenda"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 text-sm w-full"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-400 text-sm w-full md:w-56"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-purple-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                            No. Agenda
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                            Perihal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                            Pengaju
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black-600 uppercase">
                                            Status Terkini
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-black-600 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((surat) => (
                                            <tr
                                                key={surat.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-700">
                                                    {surat.no_agenda}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate">
                                                    {surat.perihal}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {surat.pengaju}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-md inline-block ${getStatusBadgeClass(
                                                            surat.status_terkini
                                                        )}`}
                                                    >
                                                        {surat.status_terkini}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedSurat(
                                                                surat
                                                            )
                                                        }
                                                        className="p-2 text-violet-600 hover:bg-violet-100 rounded-full transition-colors duration-200"
                                                        title="Lihat Detail"
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
                                                colSpan={5}
                                                className="text-center py-8 text-gray-400"
                                            >
                                                Tidak ada surat yang cocok
                                                dengan kriteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>

                    {selectedSurat && (
                        <DetailModal
                            surat={selectedSurat}
                            onClose={() => setSelectedSurat(null)}
                        />
                    )}
                </div>
            </main>
        </BagianUmumLayout>
    );
}
