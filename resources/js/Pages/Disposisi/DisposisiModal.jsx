import React, { useEffect, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
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

// Komponen untuk detail data
const DetailItem = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2.5 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="sm:col-span-2 text-sm text-gray-800">{children}</dd>
    </div>
);

// Komponen untuk timeline tracking vertikal
const TrackingItem = ({ item, isLast }) => {
    // [PERUBAHAN]: Logika getIcon direvisi sesuai aturan baru
    const getIcon = (status) => {
        const lowerStatus = status?.toLowerCase() || "";
        if (lowerStatus.includes("selesai"))
            return <CheckCircleOutlined className="text-green-500" />;
        if (lowerStatus.includes("dikembalikan"))
            return <CloseCircleOutlined className="text-red-500" />;

        // Aturan spesifik: jam kuning HANYA untuk "menunggu verifikasi"
        if (lowerStatus.includes("menunggu verifikasi"))
            return <ClockCircleOutlined className="text-yellow-500" />;

        // Aturan untuk proses/aksi: panah biru untuk "disposisi" atau "tindak lanjut"
        if (
            lowerStatus.includes("disposisi") ||
            lowerStatus.includes("tindak lanjut")
        )
            return <ArrowRightOutlined className="text-blue-500" />;

        // Aturan fallback jika masih ada kata "menunggu" lainnya
        if (lowerStatus.includes("menunggu"))
            return <ClockCircleOutlined className="text-yellow-500" />;

        return <MailOutlined className="text-gray-500" />; // Ikon default
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
                    {item.status?.nama_status}
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

export default function DisposisiModal({
    show,
    onClose,
    surat,
    tujuanDisposisi,
    catatanDisposisi,
    isReadOnly = false,
}) {
    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            surat_masuk_id: "",
            ke_user_id: "",
            catatan_disposisi_id: "",
            catatan_manual: "",
        });

    transform((data) => ({
        ...data,
        catatan_disposisi_id:
            data.catatan_disposisi_id === "lainnya"
                ? null
                : data.catatan_disposisi_id,
    }));
    const [isLainnyaSelected, setIsLainnyaSelected] = useState(false);

    useEffect(() => {
        if (surat) {
            setData({
                surat_masuk_id: surat.id,
                ke_user_id: "",
                catatan_disposisi_id: "",
                catatan_manual: "",
            });
            setIsLainnyaSelected(false);
        } else {
            reset();
            setIsLainnyaSelected(false);
        }
    }, [surat]);

    useEffect(() => {
        setIsLainnyaSelected(data.catatan_disposisi_id === "lainnya");
        if (data.catatan_disposisi_id !== "lainnya")
            setData("catatan_manual", "");
    }, [data.catatan_disposisi_id]);

    const submit = (e) => {
        e.preventDefault();
        post(route("disposisi.store"), {
            onSuccess: () => {
                onClose();
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Surat berhasil didisposisikan.",
                    timer: 3000,
                    showConfirmButton: false,
                });
                router.reload({
                    only: ["suratMenunggu"],
                    preserveScroll: true,
                });
            },
            onError: (errorsData) => {
                const errorMessage =
                    Object.values(errorsData)[0] ||
                    "Terjadi kesalahan saat disposisi.";
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: errorMessage,
                });
            },
        });
    };

    if (!show || !surat) return null;

    return (
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
                        {isReadOnly
                            ? "Detail Riwayat Surat"
                            : "Formulir Disposisi Surat"}
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
                                {surat.nomor_agenda || "-"}
                            </DetailItem>
                            <DetailItem label="Perihal">
                                {surat.perihal}
                            </DetailItem>
                            <DetailItem label="Pengaju">
                                <div className="flex items-center">
                                    <span>{surat.pengaju?.name}</span>

                                    {/* Tampilkan level hanya jika Mahasiswa atau Pegawai */}
                                    {surat.pengaju?.level_user?.nama_level &&
                                        (surat.pengaju.level_user.nama_level.toLowerCase() === 'mahasiswa' ||
                                        surat.pengaju.level_user.nama_level.toLowerCase() === 'pegawai')
                                    && (
                                        <span className="ml-2 px-2 py-0.5 bg-violet-200 text-violet-800 text-xs font-semibold rounded-full">
                                            {surat.pengaju.level_user.nama_level}
                                        </span>
                                    )}
                                </div>
                            </DetailItem>
                            <DetailItem label="Tgl Pengajuan">
                                {dayjs(surat.tanggal_pengajuan).format(
                                    "DD MMMM YYYY"
                                )}
                            </DetailItem>
                            <DetailItem label="Urgensi">
                                <span className="px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                    {surat.urgensi?.nama_urgensi || "Tidak Ada"}
                                </span>
                            </DetailItem>
                            <DetailItem label="File Surat">
                                {surat.file_path ? (
                                    <a
                                        href={`/storage/${surat.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 hover:underline inline-flex items-center"
                                    >
                                        <FileTextOutlined className="mr-2" />{" "}
                                        Lihat File
                                    </a>
                                ) : (
                                    <span className="italic text-gray-500">
                                        Tidak ada file
                                    </span>
                                )}
                            </DetailItem>

                        </dl>

                        <div className="mt-5">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Isi Surat / Keterangan
                            </h4>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-800 max-h-32 text-sm overflow-y-auto whitespace-pre-wrap">
                                {surat.keterangan ||
                                    "Tidak ada isi atau keterangan tambahan."}
                            </div>
                        </div>
                    </section>

                    {/* BAGIAN 2: RIWAYAT TRACKING */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Riwayat Tracking
                        </h3>
                        <div className="flow-root">
                            {(surat.tracking || []).map((item, index) => (
                                <TrackingItem
                                    key={item.id}
                                    item={item}
                                    isLast={index === surat.tracking.length - 1}
                                />
                            ))}
                        </div>
                    </section>

                    {/* BAGIAN 3: FORMULIR DISPOSISI (JIKA TIDAK READ-ONLY) */}
                    {!isReadOnly && (
                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Formulir Disposisi
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="ke_user_id"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Disposisikan Kepada{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="ke_user_id"
                                        value={data.ke_user_id}
                                        onChange={(e) =>
                                            setData(
                                                "ke_user_id",
                                                e.target.value
                                            )
                                        }
                                        className={`block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${
                                            errors.ke_user_id
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    >
                                        <option value="">
                                            Pilih Pejabat/Unit
                                        </option>
                                        {(tujuanDisposisi || []).map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ke_user_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.ke_user_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="catatan_disposisi_id"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Pilihan Catatan Disposisi{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="catatan_disposisi_id"
                                        value={data.catatan_disposisi_id}
                                        onChange={(e) =>
                                            setData(
                                                "catatan_disposisi_id",
                                                e.target.value
                                            )
                                        }
                                        className={`block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${
                                            errors.catatan_disposisi_id
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        required
                                    >
                                        <option value="">
                                            Pilih Catatan Disposisi
                                        </option>
                                        {(catatanDisposisi || []).map(
                                            (catatan) => (
                                                <option
                                                    key={catatan.id}
                                                    value={catatan.id}
                                                >
                                                    {catatan.isi_catatan}
                                                </option>
                                            )
                                        )}
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                    {errors.catatan_disposisi_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.catatan_disposisi_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="catatan_manual"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Catatan Disposisi Lainnya
                                    </label>
                                    <textarea
                                        id="catatan_manual"
                                        rows="3"
                                        value={data.catatan_manual}
                                        onChange={(e) =>
                                            setData(
                                                "catatan_manual",
                                                e.target.value
                                            )
                                        }
                                        className={`block w-full border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${
                                            errors.catatan_manual
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder="Catatan ini bisa di isi jika memilih *Lainnya pada form *Pilih Catatan Disposisi"
                                        disabled={!isLainnyaSelected}
                                    ></textarea>
                                    {errors.catatan_manual && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.catatan_manual}
                                        </p>
                                    )}
                                </div>
                                <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing
                                            ? "Mengirim..."
                                            : "Kirim Disposisi"}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
