"use client"; //permite que se usar los hooks 
import { useState } from "react"; // Hooks de React para manejar el estado y efectos secundarios
import { useRouter } from "next/navigation"; // Hook para redireccionar al usuario
import Link from "next/link"; //Componente de optimización entre las páginas

export default function RegisterPage() {
    //ESTADOS DE FORMULARIO
    // Usamos un objeto para agrupar todos los campos del formulario en un solo estado
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(""); // Para capturar y mostrar errores de validación o red
    const [loading, setLoading] = useState(false); // Para gestionar el estado visual del botón de envío
    const router = useRouter();
    //Manejador de entrada universal
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    //Procesa el envío del formulario
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Petición POST al endpoint de registro
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            //Si la respuesta no es exitosa (ej. email ya existe), lanzamos error
            if (!response.ok) { 
                throw new Error(data.error || "Error al registrarse");
            }
            // Si el registro es correcto, redirigimos al login con un parámetro de éxito
            router.push("/login?success=true");
        } catch (err) { //Manejo
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    //FRONTED
    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-6">
            {/* CONTENEDOR TIPO TARJETA */}
            <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-900 rounded-2xl p-10 shadow-2xl">
                
                {/* CABECERA Y ESLOGAN*/}
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
                {/* FORMULARIO DE REGISTRO */}
                <form onSubmit={handleRegister} className="space-y-8">
                    {/* Campo: Nombre Completo */}
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
                    {/* Campo: Email */}
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
                    {/* Campo: Contraseña */}
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
                    {/* BOTÓN DE ACCIÓN: Cambia el texto dinámicamente según el estado 'loading' */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.98] disabled:bg-gray-800 shadow-xl mt-4"
                    >
                        {loading ? "PROCESANDO..." : "REGISTRARSE"}
                    </button>
                </form>
                {/* ENLACE DE RETORNO AL LOGIN */}
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