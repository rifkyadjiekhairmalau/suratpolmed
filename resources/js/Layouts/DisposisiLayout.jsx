// resources/js/layouts/DisposisiLayout.jsx

import DisposisiSidebar from '@/layouts/Partials/DisposisiSidebar'; // Perbarui impor sesuai nama komponen yang baru

export default function DisposisiLayout({ header, children }) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            <DisposisiSidebar />
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
