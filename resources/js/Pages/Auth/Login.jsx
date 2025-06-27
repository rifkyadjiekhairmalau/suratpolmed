import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "", // ganti dari email ke username
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form
                onSubmit={submit}
                className="bg-white/80 rounded-xl shadow-lg p-6"
            >
                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full border-violet-300 focus:border-violet-500 focus:ring-violet-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                        placeholder="Masukkan NIM/NIP/ID"
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-violet-300 focus:border-violet-500 focus:ring-violet-500"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Masukkan Password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-violet-700">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex flex-col gap-4 items-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-violet-600 underline hover:text-violet-800 transition"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton
                        className="bg-violet-600 hover:bg-violet-700 transition text-white font-semibold"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Belum punya akun? </span>
                <Link
                    href={route("register")}
                    className="text-violet-600 hover:underline font-semibold"
                >
                    Daftar di sini
                </Link>
            </div>
        </GuestLayout>
    );
}
