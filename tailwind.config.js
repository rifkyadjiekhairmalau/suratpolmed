import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
// import typography from '@tailwindcss/typography'; // Jika Anda butuh, uncomment baris ini

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx', // Memastikan file .jsx disertakan
        // './resources/js/**/*.js', // Jika Anda punya file .js selain .jsx, tambahkan baris ini
    ],

    theme: {
        extend: {
            fontFamily: {
                // Poppins diletakkan di awal array 'sans'
                // Anda bisa menghapus 'Figtree' jika ingin sepenuhnya menggantinya
                sans: ['Poppins', 'Instrument Sans', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    // Tambahkan 'typography' jika Anda membutuhkannya:
    plugins: [forms /* , typography */],
};
