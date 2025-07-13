import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
            onError: (errors) => {
                const errorMessage = errors.username || errors.password;
                if (errorMessage) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: 'Username atau Password Anda tidak terdaftar',
                        confirmButtonColor: '#6d28d9',
                    });
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg">

                <h2 className="text-2xl text-center font-bold text-black mb-1">Masuk Untuk Memulai</h2>
                <p className="text-gray-800 text-sm mb-6 text-center">
                    Isi data login Anda untuk melanjutkan
                </p>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="username" value="Username" className="text-black font-semibold" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <UserIcon />
                            </div>
                            <TextInput
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                onChange={(e) => setData("username", e.target.value)}
                                className="mt-1 block w-full pl-10 border-violet-300 focus:border-violet-500 focus:ring-violet-500"
                                placeholder="Masukkan NIM/NIP/ID"
                                autoComplete="username"
                                isFocused
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-black font-semibold" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <KeyIcon />
                            </div>
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="mt-1 block w-full pl-10 border-violet-300 focus:border-violet-500 focus:ring-violet-500"
                                placeholder="Masukkan Password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showPassword ? <EyeIcon /> : <EyeSlashIcon /> }
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-end">
                        <PrimaryButton
                            className="block w-1/3 mx-auto flex justify-center bg-violet-600 hover:bg-violet-700 transition text-white font-semibold py-3 rounded"
                            disabled={processing}
                        >
                            Login
                        </PrimaryButton>
                    </div>
                </form>

            </div>
        </GuestLayout>
    );
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9a3 3 0 100-6 3 3 0 000 6zM3 18a7 7 0 0114 0H3z" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);
