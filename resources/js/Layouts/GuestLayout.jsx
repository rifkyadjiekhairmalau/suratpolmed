import React, { useState, useEffect } from 'react';

// --- PERUBAHAN: Daftar gambar untuk slideshow ---
// Anda bisa mengganti URL dan deskripsi gambar di sini
const images = [
    {
        id: 1,
        src: 'https://iptek.co.id/wp-content/uploads/2022/10/Surat-Digital-1024x683.jpg',
        alt: 'Sistem surat'
    },
    {
        id: 2,
        src: 'https://mi.polmed.ac.id/wp-content/uploads/sites/20/2025/03/lab3-1024x768.jpg',
        alt: 'Ruangan lab trmg'
    },
    {
        id: 3,
        src: 'https://i.pinimg.com/736x/90/c5/03/90c5038cfa8367372930bbd769a065ad.jpg',
        alt: 'Gedung z'
    }
];

export default function GuestLayout({ children }) {
    // --- PERUBAHAN: State untuk mengelola gambar yang aktif ---
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // --- PERUBAHAN: Efek untuk mengganti gambar setiap 5 detik ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2500); // Ganti gambar setiap 5 detik

        // Membersihkan interval saat komponen tidak lagi digunakan
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen w-full flex">
            {/* Kolom kiri - Ilustrasi dan Teks */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                {/* --- PERUBAHAN: Container untuk Slideshow --- */}
                {images.map((image, index) => (
                    <img
                        key={image.id}
                        src={image.src}
                        alt={image.alt}
                        className={`
                            absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
                            ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}
                        `}
                    />
                ))}

                {/* --- PERUBAHAN: Overlay untuk memastikan teks terbaca --- */}
                <div className="absolute inset-0 bg-violet-800/30" />

                {/* Kontainer untuk memusatkan konten di atas slideshow */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    {/* Logo */}
                    <img
                        src="https://polmed.ac.id/wp-content/uploads/2014/04/logo-polmed-png.png"
                        alt="Logo Politeknik Negeri Medan"
                        className="w-48 h-auto drop-shadow-lg" // Ukuran logo disesuaikan
                    />

                    {/* Teks Deskripsi Sistem */}
                    <div className="mt-6">
                        <h1 className="text-white text-3xl font-bold tracking-wide drop-shadow-md">
                            Sistem Informasi Persuratan
                        </h1>
                        <p className="text-white mt-2 text-lg drop-shadow-md">
                            Politeknik Negeri Medan
                        </p>
                    </div>
                </div>
            </div>

            {/* Kolom kanan - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 bg-violet-400">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
