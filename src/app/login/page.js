"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al iniciar sesión");
            }

            // 1. VITAL PARA EL MIDDLEWARE: Guardar el token en Cookies
            document.cookie = `token=${data.token}; path=/; max-age=3600; samesite=strict`;

            // 2. Guardar en localStorage (para uso interno de otros componentes)
            localStorage.setItem("token", data.token);

            // 3. Redirigir a la biblioteca
            router.push("/books");
            router.refresh(); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-6">
            {/* RECUADRO ESTILO METAMORFOSIS */}
            <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-900 rounded-2xl p-10 shadow-2xl">
                
                {/* TÍTULO CON LÍNEA LATERAL */}
                <div className="text-left mb-10 border-l border-white pl-5">
                    <h1 className="font-serif-logo text-3xl mb-1 text-white">Entrar</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">
                        Continúa tu metamorfosis
                    </p>
                </div>

                {error && (
                    <div className="mb-6 border border-red-900/30 bg-red-950/10 p-4 text-[10px] uppercase tracking-widest text-red-500 font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? "VERIFICANDO..." : "INICIAR SESIÓN"}
                    </button>
                </form>

                <p className="mt-10 text-center text-[9px] uppercase tracking-[0.2em] text-gray-700">
                    ¿Aún no tienes cuenta?{" "}
                    <Link href="/register" className="font-bold text-white hover:underline ml-1">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}