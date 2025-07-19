import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Modal } from "antd";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

// Komponen untuk menampilkan setiap item data dengan rapi
const DetailItem = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2.5 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="sm:col-span-2 text-sm text-gray-800">{children}</dd>
    </div>
);

// Komponen untuk timeline riwayat tracking dengan ikon dinamis
const TrackingItem = ({ item, isLast }) => {
    const getIcon = (status) => {
        const lowerStatus = status?.toLowerCase() || "";
        if (lowerStatus.includes("selesai")) return <CheckCircleOutlined className="text-green-500" />;
        if (lowerStatus.includes("dikembalikan")) return <CloseCircleOutlined className="text-red-500" />;
        if (lowerStatus.includes("disposisi") || lowerStatus.includes("tindak lanjut") || lowerStatus.includes("proses")) return <ArrowRightOutlined className="text-blue-500" />;
        if (lowerStatus.includes("menunggu")) return <ClockCircleOutlined className="text-yellow-500" />;
        return <MailOutlined className="text-gray-500" />;
    };

    return (
        <div className="relative flex pb-8">
            {!isLast && (
                <div className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"></div>
            )}
            <div className="relative flex h-10 w-10 flex-none items-center justify-center bg-white">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg ring-8 ring-white">
                    {getIcon(item.status?.nama_status)}
                </div>
            </div>
            <div className="flex-grow pl-4">
                <p className="text-sm font-medium text-gray-800">
                    {item.status.nama_status}
                </p>
                <p className="text-sm text-gray-500">
                    {dayjs(item.created_at).format("DD MMM YYYY, HH:mm")}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                        {item.dariUser && item.keUser
                            ? `Dari ${item.dariUser.name} ke ${item.keUser.name}`
                            : `Oleh: ${item.user?.name || "Sistem"}`}

                        {/* Blok kondisional untuk menampilkan level user tertentu */}
                        {item.user?.level_user?.nama_level &&
                            (item.user.level_user.nama_level.toLowerCase() ===
                                "mahasiswa" ||
                                item.user.level_user.nama_level.toLowerCase() ===
                                    "pegawai") && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-violet-200 text-violet-700 text-[10px] font-semibold rounded-md">
                                    {item.user.level_user.nama_level}
                                </span>
                            )}
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

export default function KasubagModal({ show, onClose, surat, isReadOnly = false }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        catatan_tindak_lanjut: "",
    });

    const [formError, setFormError] = useState(null);

    const handleClose = () => {
        reset("catatan_tindak_lanjut");
        setFormError(null);
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        setFormError(null);
        post(route("kasubag.selesaikan", surat.id), {
            onSuccess: () => handleClose(),
            onError: () => {
                setFormError("Gagal menyimpan. Periksa kembali isian dan koneksi Anda.");
            },
        });
    };

    const instruksiTracking = surat?.tracking?.[0];
    const levelPengaju = surat?.pengaju?.level_user?.nama_level?.toLowerCase();

    return (
        <Modal
        className="font-sans"
            title={
                <h3 className="text-2xl font-bold text-gray-800">
                    {isReadOnly ? "Detail Riwayat Surat" : "Formulir Tindak Lanjut Surat"}
                </h3>
            }
            open={show}
            onCancel={handleClose}
            footer={null}
            // [PERUBAHAN]: Modal dilebarkan agar sama dengan DisposisiModal
            width="100vw"
            style={{ maxWidth: '900px', top: 60 }} // Memberi batas lebar maksimum dan posisi dari atas
            destroyOnClose
            // Pengaturan bodyStyle sudah benar untuk membuat konten bisa di-scroll
            bodyStyle={{
                maxHeight: 'calc(100vh - 210px)',
                overflowY: 'auto',
            }}
        >
            {surat && (
                <div className="pt-2 pb-6 space-y-8">
                    {/* --- BAGIAN DETAIL SURAT --- */}
                    <section>
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Detail Surat</h4>
                        <dl>
                            <DetailItem label="No. Agenda">{surat.nomor_agenda || "-"}</DetailItem>
                            <DetailItem label="Perihal">{surat.perihal}</DetailItem>
                            <DetailItem label="Pengaju">
                                <div className="flex items-center">
                                    <span>{surat.pengaju?.name}</span>
                                    {levelPengaju && (levelPengaju === 'mahasiswa' || levelPengaju === 'pegawai') && (
                                        <span className="ml-2 px-2 py-0.5 bg-violet-200 text-violet-800 text-xs font-semibold rounded-full">
                                            {surat.pengaju.level_user.nama_level}
                                        </span>
                                    )}
                                </div>
                            </DetailItem>

                            {levelPengaju === 'mahasiswa' && (
                                <>
                                    <DetailItem label="NIM">{surat.pengaju?.mahasiswa?.nim || 'N/A'}</DetailItem>
                                    <DetailItem label="Program Studi">{surat.pengaju?.mahasiswa?.prodi?.nama_prodi || 'N/A'}</DetailItem>
                                </>
                            )}

                            {levelPengaju === 'pegawai' && (
                                <>
                                    <DetailItem label="NIP">{surat.pengaju?.pegawai?.nip || 'N/A'}</DetailItem>
                                    <DetailItem label="Jabatan">{surat.pengaju?.pegawai?.jabatan?.nama_jabatan || 'N/A'}</DetailItem>
                                </>
                            )}
                            <DetailItem label="Jenis Surat">
                                {surat.jenis_surat?.nama_jenis || <span className="italic">{surat.jenis_surat_manual || "-"}</span>}
                            </DetailItem>
                            <DetailItem label="Tanggal Pengajuan">
                                {dayjs(surat.tanggal_pengajuan).format("DD MMMM YYYY")}
                            </DetailItem>
                            <DetailItem label="Urgensi">
                                <span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                    {surat.urgensi?.nama_urgensi || "Tidak ada"}
                                </span>
                            </DetailItem>
                            <DetailItem label="File Surat">
                                {surat.file_path ? (
                                    <a href={`/storage/${surat.file_path}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">
                                        <FileTextOutlined className="mr-2" /> Lihat File
                                    </a>
                                ) : (
                                    <span className="italic text-gray-500">Tidak ada file</span>
                                )}
                            </DetailItem>
                        </dl>
                    </section>

                    {/* --- BAGIAN INSTRUKSI ATASAN --- */}
                    {/* <section>
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Instruksi disposisi</h4>
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded-lg">
                            <p className="text-sm italic">
                                "{instruksiTracking?.catatan || "Tidak ada instruksi spesifik."}"
                            </p>
                        </div>
                    </section> */}

                    {/* --- BAGIAN FORM/LAPORAN (KONDISIONAL) --- */}
                    <section>
                        {isReadOnly ? (
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">Laporan Tindak Lanjut</h4>
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded-lg">
                                    <p className="text-sm italic">
                                    {surat.latest_tracking?.catatan || "Tidak ada catatan."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={submit}>
                                <h4 className="text-lg font-semibold text-gray-700 mb-3">Formulir Tindak Lanjut</h4>
                                {formError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                                        <span className="block sm:inline">{formError}</span>
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="catatan_tindak_lanjut" className="block text-sm font-medium text-gray-700 mb-1">
                                        Catatan / Laporan Tindak Lanjut <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="catatan_tindak_lanjut"
                                        rows={4}
                                        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm ${errors.catatan_tindak_lanjut ? 'border-red-500' : ''}`}
                                        value={data.catatan_tindak_lanjut}
                                        onChange={(e) => setData("catatan_tindak_lanjut", e.target.value)}
                                        placeholder="Contoh: Ruangan sudah dipesan untuk tanggal..."
                                    />
                                    {errors.catatan_tindak_lanjut && <p className="mt-1 text-xs text-red-600">{errors.catatan_tindak_lanjut}</p>}
                                </div>
                                <div className="flex justify-end items-center mt-6 space-x-3">
                                    <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 disabled:bg-violet-400">
                                        {processing ? 'Menyimpan...' : 'Selesaikan Surat'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>

                    {/* --- BAGIAN RIWAYAT TRACKING --- */}
                    <section>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Riwayat Tracking</h4>
                        <div className="flow-root">
                             {(surat.tracking || []).map((item, index) => (
                                <TrackingItem key={item.id} item={item} isLast={index === surat.tracking.length - 1} />
                             ))}
                        </div>
                    </section>
                </div>
            )}
        </Modal>
    );
}
