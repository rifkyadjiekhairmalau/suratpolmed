import React from "react";
import { Link } from "@inertiajs/react";

// Impor ikon Font Awesome dari react-icons
import {
    FaTachometerAlt,
    FaUsers,
    FaUserGraduate,
    FaBriefcase,
    FaSignOutAlt,
} from "react-icons/fa";

export default function AdminSidebar() {
    // Violet modern style
    const activeClass =
        "flex items-center p-3 text-violet-900 bg-white rounded-xl font-bold shadow transition duration-200 mb-2";
    const inactiveClass =
        "flex items-center p-3 text-violet-100 hover:text-white hover:bg-violet-400 rounded-xl font-medium transition duration-200 mb-2";

    // Ukuran dan margin ikon default untuk konsistensi
    const iconClass = "w-5 h-5 mr-3"; // Sesuaikan jika perlu, FaIcons mungkin punya ukuran intrinsik

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
    <p className="text-sm text-violet-200">Administrator</p>
</div>
                <nav>
                    {/* Link ke Dashboard Admin - Menggunakan FaTachometerAlt untuk ikon dashboard */}
                    <Link
                        href={route("admin.dashboard")}
                        className={
                            route().current("admin.dashboard")
                                ? activeClass
                                : inactiveClass
                        }
                    >
                        <FaTachometerAlt className={iconClass} />
                        Dashboard
                    </Link>

                    {/* Link ke Manajemen Pengguna - Menggunakan FaUsers */}
                    <Link
                        href={route("admin.users.index")}
                        className={
                            route().current("admin.users.index")
                                ? activeClass
                                : inactiveClass
                        }
                    >
                        <FaUsers className={iconClass} />
                        Manajemen Pengguna
                    </Link>

                    {/* Link ke Manajemen Pegawai - Menggunakan FaBriefcase */}
                    <Link
                        href={route("admin.pegawai.index")}
                        className={
                            route().current("admin.pegawai.index")
                                ? activeClass
                                : inactiveClass
                        }
                    >
                        <FaBriefcase className={iconClass} />
                        Manajemen Pegawai
                    </Link>

                    {/* Link ke Manajemen Mahasiswa - Menggunakan FaUserGraduate */}
                    <Link
                        href={route("admin.mahasiswa.index")}
                        className={
                            route().current("admin.mahasiswa.index")
                                ? activeClass
                                : inactiveClass
                        }
                    >
                        <FaUserGraduate className={iconClass} />
                        Manajemen Mahasiswa
                    </Link>
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
