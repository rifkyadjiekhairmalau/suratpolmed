import React from 'react';
import KasubagSidebar from '@/Layouts/Partials/KasubagSidebar'; // Pastikan path ini benar

export default function KasubagLayout({ header, children, user }) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            {/* Sidebar untuk Kasubag akan muncul di sini */}
            <KasubagSidebar user={user} /> {/* Meneruskan user prop jika dibutuhkan oleh sidebar */}

            <main className="flex-1 p-6 md:p-8">
                {header && (
                    <header className="bg-white shadow mb-6 rounded-lg">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}
                {children}
            </main>
        </div>
    );
}
