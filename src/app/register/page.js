"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al registrarse");
            }

            router.push("/login?success=true");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-6">
            {/* RECUADRO CON FONDO DIFERENTE */}
            <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-900 rounded-2xl p-10 shadow-2xl">
                
                {/* TÍTULO INTERNO */}
                <div className="">
                    <h1 className="font-serif-logo text-3xl mb-1 text-white">Únete</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">
                        Crea tu biblioteca personal
                    </p>
                </div>

                {error && (
                    <div className="mb-6 border border-red-900/30 bg-red-950/10 p-4 text-[10px] uppercase tracking-widest text-red-500 font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-8">
                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">
                            Nombre Completo
                        </label>
                        <input
                            name="name"
                            type="text"
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900"
                            placeholder="TU NOMBRE"
                            required
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900"
                            placeholder="CORREO@EJEMPLO.COM"
                            required
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">
                            Contraseña
                        </label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.98] disabled:bg-gray-800 shadow-xl mt-4"
                    >
                        {loading ? "PROCESANDO..." : "REGISTRARSE"}
                    </button>
                </form>

                <p className="mt-10 text-center text-[9px] uppercase tracking-[0.2em] text-gray-700">
                    ¿Ya eres miembro?{" "}
                    <Link href="/login" className="font-bold text-white hover:underline ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}