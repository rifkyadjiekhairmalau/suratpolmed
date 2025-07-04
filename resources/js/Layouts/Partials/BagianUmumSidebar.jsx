import React from "react";
import { Link } from "@inertiajs/react";

// Impor ikon Font Awesome dari react-icons
import {
    FaTachometerAlt,
    FaSignOutAlt,
} from "react-icons/fa";

import { LuFileInput, LuFileOutput } from "react-icons/lu";

// Komponen Sidebar untuk Bagian Umum
export default function BagianUmumSidebar() {
    // Gaya untuk link yang aktif dan tidak aktif
    const activeClass = "flex items-center p-3 text-violet-900 bg-white rounded-xl font-bold shadow transition duration-200 mb-2";
    const inactiveClass = "flex items-center p-3 text-violet-100 hover:text-white hover:bg-violet-400 rounded-xl font-medium transition duration-200 mb-2";

    // Kelas untuk ikon agar konsisten
    const iconClass = "w-5 h-5 mr-3";

    return (
        <aside className="sidebar min-h-screen bg-gradient-to-b from-violet-700 via-violet-500 to-violet-900 p-6 flex flex-col justify-between rounded-[0px] w-[260px]">
            <div>
                <div className="text-center mb-10">
                    <img
                        src="https://polmed.ac.id/wp-content/uploads/2014/04/logo-polmed-png.png"
                        alt="Logo Sistem Surat"
                        className="w-24 h-24 mx-auto mb-4 object-contain"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/CCCCCC/333333?text=Error" }}
                    />
                    <h3 className="text-2xl font-bold text-white mb-1">
                        Sistem Surat
                    </h3>
                    <p className="text-sm text-violet-200">Administrasi Umum</p>
                </div>
                <nav>
                    {/* ======================================================================= */}
                    {/* PERBAIKAN: Menggunakan fungsi route() untuk href dan pengecekan aktif */}
                    {/* ======================================================================= */}

                    {/* Link ke Dashboard Bagian Umum */}
                    <Link
                        href={route('administrasi_umum.dashboard')}
                        className={route().current('administrasi_umum.dashboard') ? activeClass : inactiveClass}
                    >
                        <FaTachometerAlt className={iconClass} />
                        Dashboard
                    </Link>

                    {/* Link ke Surat Masuk (Terverifikasi) */}
                    <Link
                        href={route('administrasi_umum.suratmasuk.terverifikasi.index')}
                        className={route().current('administrasi_umum.suratmasuk.terverifikasi.index') ? activeClass : inactiveClass}
                    >
                        <LuFileInput className={iconClass} />
                        Surat Masuk
                    </Link>

                    {/* Link ke Surat Keluar (Asumsi nama route) */}
                    {/* Pastikan Anda memiliki route dengan nama 'administrasi_umum.suratkeluar.index' */}
                    <Link
                        href={route('administrasi_umum.suratkeluar.index')}
                        className={route().current('administrasi_umum.suratkeluar.index') ? activeClass : inactiveClass}
                    >
                        <LuFileOutput className={iconClass} />
                        Surat Keluar
                    </Link>
                </nav>
            </div>
            <div className="mt-8">
                {/* Link Logout */}
                <Link
                    href={route('logout')} // Menggunakan route helper untuk logout
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
