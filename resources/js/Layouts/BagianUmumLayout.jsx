import React from 'react';
import BagianUmumSidebar from './partials/BagianUmumSidebar'; // Path ini tetap sama

export default function BagianUmumLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <BagianUmumSidebar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
