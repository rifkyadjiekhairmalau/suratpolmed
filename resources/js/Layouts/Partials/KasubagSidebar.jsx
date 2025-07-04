import { Link, usePage } from "@inertiajs/react";
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

// Komponen untuk satu link di sidebar, dengan styling yang diperbaiki
const SidebarLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`group mb-2 flex items-center rounded-xl p-3 font-bold transition duration-200 ${
            active
                ? "bg-white text-purple-900 shadow" // Gaya untuk link yang sedang aktif
                : "text-purple-100 hover:bg-white/90 hover:text-purple-900" // Gaya untuk link normal
        }`}
    >
        {children}
    </Link>
);

const activeClass =
    "flex items-center p-3 text-violet-900 bg-white rounded-xl font-bold shadow transition duration-200 mb-2";
const inactiveClass =
    "flex items-center p-3 text-violet-100 hover:text-white hover:bg-violet-400 rounded-xl font-medium transition duration-200 mb-2";
const iconClass = "w-5 h-5 mr-3";

// Ikon untuk Notifikasi (menggunakan ikon lonceng yang umum)
const WaitingDisposisiIcon = () => ( <svg className="mr-3 h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" > <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> </svg> );

// Ikon untuk Riwayat Tindak Lanjut (opsional, jika Kasubag punya riwayat sendiri)
const HistoryIcon = () => (
    <svg
        className="mr-3 h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
    </svg>
);


// Ganti nama function DisposisiSidebar menjadi KasubagSidebar
export default function KasubagSidebar() {
    const { auth } = usePage().props;
    const { url } = usePage(); // Mendapatkan URL saat ini dari usePage

    // Fungsi untuk mengecek apakah link aktif
    const isActive = (route_name) => {
        return route().current(route_name);
    };

    return (
        <aside className="sidebar min-h-screen bg-gradient-to-b from-violet-700 via-violet-500 to-violet-900 p-6 flex flex-col justify-between rounded-[0px] w-[260px]">
            <div>
                <div className="mb-10 text-center">
                    <img
                        src="https://polmed.ac.id/wp-content/uploads/2014/04/logo-polmed-png.png"
                        alt="Logo Sistem Surat"
                        className="w-24 h-24 mx-auto mb-4 object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://placehold.co/96x96/CCCCCC/333333?text=Error";
                        }}
                    />
                    <h3 className="mb-1 text-2xl font-bold text-white">
                        Sistem Surat
                    </h3>
                    <p className="text-sm text-purple-200">{auth.user.name}</p>
                </div>
                <nav>
                    {/* Menu untuk Notifikasi Kasubag */}
                    {/* Asumsi route name untuk halaman notifikasi Kasubag adalah 'kasubag.notifikasi'
                        atau 'notifikasi' jika itu route spesifik Kasubag
                        Saya akan pakai 'kasubag.menunggu' dan 'kasubag.riwayat' untuk konsistensi dengan pola sebelumnya
                        jika kasubag juga punya halaman menunggu & riwayat tindak lanjut.
                    */}
                    <SidebarLink
                        href={route("kasubag.menunggu")}
                        active={isActive("kasubag.menunggu")}
                    >
                        <WaitingDisposisiIcon /> {/* Gunakan ikon Notifikasi */}
                        <span>Menunggu Tindak Lanjut</span>
                    </SidebarLink>

                    {/* Jika ada halaman riwayat khusus untuk Kasubag */}
                    <SidebarLink
                        href={route("kasubag.riwayat")}
                        active={isActive("kasubag.riwayat")}
                    >
                        <HistoryIcon /> {/* Gunakan ikon Riwayat */}
                        <span>Riwayat Tindak Lanjut</span>
                    </SidebarLink>
                </nav>
            </div>
            <div className="mt-8">
                {/* Link Logout - Menggunakan FaSignOutAlt */}
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className={`${inactiveClass} w-full`}
                >
                    <FaSignOutAlt className={iconClass} />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
