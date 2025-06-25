import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react'; // Tambahkan import React karena ini file JSX

export default function Welcome() {
    const { auth } = usePage().props; // Menghilangkan <SharedData>

    return (
        <>
            <Head title="Sistem Surat POLMED">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-violet-100 via-violet-200 to-violet-400 p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                <header className="mb-6 w-full max-w-[335px] lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-xl border border-violet-400 px-5 py-1.5 text-sm font-semibold text-violet-800 bg-white shadow hover:bg-violet-50 hover:text-violet-900 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-block rounded-xl border border-violet-400 px-5 py-1.5 text-sm font-semibold text-violet-800 bg-white shadow hover:bg-violet-50 hover:text-violet-900 transition"
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                </header>
                <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row items-center">
                    <div className="flex-1 rounded-b-2xl bg-white/90 p-8 pb-12 text-[15px] leading-[22px] shadow-xl lg:rounded-l-2xl lg:rounded-br-none lg:p-16">
                        <div className="mb-6 flex justify-center">
                            <div className="w-24 h-24 rounded-full border-4 border-violet-300 flex items-center justify-center text-violet-700 text-2xl font-bold bg-gradient-to-b from-violet-200 to-violet-400 shadow-inner select-none">
                                POLMED
                            </div>
                        </div>
                        <h1 className="mb-2 text-3xl font-extrabold text-violet-800 text-center tracking-tight">Sistem Surat POLMED</h1>
                        <p className="mb-6 text-center text-violet-600 font-medium">
                            Platform digital untuk pengajuan, disposisi, dan manajemen surat-menyurat di Politeknik Negeri Medan.
                        </p>
                        <div className="flex justify-center">
                            <Link
                                href={route('login')}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold shadow-lg hover:from-violet-700 hover:to-violet-600 transition text-lg"
                            >
                                Masuk ke Sistem
                            </Link>
                        </div>
                    </div>
                    <div className="relative aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-2xl bg-gradient-to-br from-violet-200 via-violet-100 to-white lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-2xl flex items-center justify-center">
                        <svg
                            className="w-3/4 max-w-xs lg:max-w-lg"
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <ellipse cx="100" cy="100" rx="90" ry="90" fill="#ede9fe" />
                            <rect x="40" y="70" width="120" height="60" rx="12" fill="#a78bfa" />
                            <rect x="55" y="85" width="90" height="30" rx="6" fill="#f5f3ff" />
                            <rect x="65" y="95" width="70" height="10" rx="3" fill="#c4b5fd" />
                            <rect x="80" y="120" width="40" height="8" rx="3" fill="#c4b5fd" />
                        </svg>
                    </div>
                </main>
                <footer className="mt-8 text-center text-violet-400 text-xs">
                    &copy; {new Date().getFullYear()} Sistem Surat POLMED. All rights reserved.
                </footer>
            </div>
        </>
    );
}
