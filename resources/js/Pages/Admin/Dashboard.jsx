import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

// Komponen untuk setiap kartu statistik
const StatCard = ({ title, value, icon }) => (
    <div className="group bg-white p-6 rounded-2xl shadow-lg flex items-center gap-5 border border-transparent transition-all duration-200 cursor-pointer hover:border-violet-500 hover:shadow-xl hover:-translate-y-1 hover:bg-violet-50">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-violet-100 group-hover:bg-violet-500 transition-all duration-200">
            {React.cloneElement(icon, {
                className: "h-7 w-7 text-violet-500 group-hover:text-white transition-all duration-200"
            })}
        </div>
        <div>
            <p className="text-black-500 text-sm font-semi-bold group-hover:text-violet-700 transition">{title}</p>
            <p className="text-3xl font-extrabold text-gray-800 group-hover:text-violet-900 transition">{value}</p>
        </div>
    </div>
);

// Ikon-ikon SVG
const MahasiswaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);
const DosenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const UsersIcon = () => (
    // Ikon Total Pengguna - People
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M7 20h5v-2a4 4 0 00-4-4H7m4-6a4 4 0 11-8 0 4 4 0 018 0zm10 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export default function Dashboard({ auth, stats = {} }) {
    const { user = 0, pegawai = 0, mahasiswa = 0 } = stats;

    return (
        <AdminLayout>
            <Head title="Dashboard Administrator" />

            {/* Container dengan background putih blur dan bayangan */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-md shadow-xl p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrator</h1>
                    <p className="text-gray-600">Ringkasan data total pengguna, pegawai dan mahasiswa dalam sistem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-bold">
                    <StatCard title="Total Pengguna" value={(user ?? 0).toString()} icon={<UsersIcon />} />
                    <StatCard title="Total Pegawai" value={(pegawai ?? 0).toString()} icon={<DosenIcon />} />
                    <StatCard title="Total Mahasiswa" value={(mahasiswa ?? 0).toString()} icon={<MahasiswaIcon />} />
                </div>
            </div>
        </AdminLayout>
    );
}
