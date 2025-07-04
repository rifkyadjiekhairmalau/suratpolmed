import React, { useEffect, useRef } from 'react';
import { Link, usePage } from "@inertiajs/react";
import { FaSignOutAlt } from "react-icons/fa";

// ... (Komponen SidebarLink dan Ikon-ikon lainnya tetap sama)
const SidebarLink = ({ href, routeName, children }) => ( <Link href={href} className={route().current(routeName) ? activeClass : inactiveClass}> {children} </Link> );
const activeClass = "flex items-center p-3 text-violet-900 bg-white rounded-xl font-bold shadow transition duration-200 mb-2";
const inactiveClass = "flex items-center p-3 text-violet-100 hover:text-white hover:bg-violet-400 rounded-xl font-medium transition duration-200 mb-2";
const iconClass = "w-7 h-7 mr-3";
const WaitingDisposisiIcon = () => ( <svg className="mr-3 h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" > <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> </svg> );
const HistoryDisposisiIcon = () => ( <svg className="mr-3 h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" > <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> );

// Ganti signature komponen untuk menerima props dari Layout
export default function DisposisiSidebar({ sidebarOpen, setSidebarOpen }) {
    const { auth } = usePage().props;
    const sidebar = useRef(null);

    // Efek untuk menutup sidebar saat area di luarnya diklik (khusus mobile)
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !sidebarOpen || sidebar.current.contains(target)) return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [sidebarOpen]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-40 flex h-screen w-64 flex-col justify-between bg-gradient-to-b from-violet-700 via-violet-500 to-violet-900 p-6 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div>
                <div className="mb-10 text-center">
                    <img
                        src="https://polmed.ac.id/wp-content/uploads/2014/04/logo-polmed-png.png"
                        alt="Logo Sistem Surat"
                        className="w-24 h-24 mx-auto mb-4 object-contain"
                    />
                    <h3 className="mb-1 text-2xl font-bold text-white">Sistem Surat</h3>
                    <p className="mt-1 text-xs font-bold tracking-widest text-purple-100 uppercase">{auth.user.name}</p>
                </div>
                <nav>
                    <SidebarLink href={route("disposisi.menunggu")} routeName="disposisi.menunggu">
                        <WaitingDisposisiIcon />
                        <span>Menunggu Disposisi</span>
                    </SidebarLink>
                    <SidebarLink href={route("disposisi.riwayat")} routeName="disposisi.riwayat">
                        <HistoryDisposisiIcon />
                        <span>Riwayat Disposisi</span>
                    </SidebarLink>
                </nav>
            </div>
            <div className="mt-8">
                <Link href={route("logout")} method="post" as="button" className={`${inactiveClass} w-full`}>
                    <FaSignOutAlt className={iconClass} />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
