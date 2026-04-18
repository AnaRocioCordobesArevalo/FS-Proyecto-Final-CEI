"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [formData, setFormData] = useState({
        tittle: "",
        author: "",
        category: "",
        image: ""
    });
    
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "loading", message: "PUBLICANDO EJEMPLAR..." });

        try {
            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ type: "success", message: "¡LIBRO AÑADIDO A LA COLECCIÓN!" });
                setTimeout(() => router.push("/books"), 2000);
            } else {
                const data = await res.json();
                setStatus({ type: "error", message: data.error || "ERROR AL PUBLICAR" });
            }
        } catch (error) {
            setStatus({ type: "error", message: "ERROR DE CONEXIÓN" });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-6">
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-gray-900 p-10 rounded-2xl shadow-2xl">
                
                {/* TÍTULO ESTILO METAMORFOSIS */}
                <div className="text-left mb-10 border-l border-white pl-5">
                    <h1 className="font-serif-logo text-3xl mb-1 text-white">Publicar</h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">
                        Añade una nueva historia
                    </p>
                </div>

                {/* Mensaje de estado */}
                {status.message && (
                    <div className={`mb-8 p-4 text-[10px] uppercase tracking-widest font-bold text-center border ${
                        status.type === "success" ? "border-green-900/30 bg-green-950/10 text-green-500" : 
                        status.type === "error" ? "border-red-900/30 bg-red-950/10 text-red-500" : "border-gray-800 bg-gray-900 text-gray-400"
                    }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">Título</label>
                        <input 
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900" 
                            placeholder="EJ: CRÓNICA DE UNA MUERTE ANUNCIADA" 
                            onChange={e => setFormData({...formData, tittle: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">Autor</label>
                        <input 
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900" 
                            placeholder="GABRIEL GARCÍA MÁRQUEZ" 
                            onChange={e => setFormData({...formData, author: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">Categoría</label>
                        <select 
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-gray-400 cursor-pointer"
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            required
                            value={formData.category}
                        >
                            <option value="" className="bg-black text-white">SELECCIONA UNA CATEGORÍA</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id} className="bg-black text-white uppercase">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SELECCIÓN DE IMAGEN */}
                    <div className="border border-dashed border-gray-800 p-6 rounded-lg text-center bg-black/40 group hover:border-gray-600 transition-colors">
                        <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4 cursor-pointer">
                            Subir Portada
                        </label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="hidden" 
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer text-[10px] text-gray-600 hover:text-white transition-colors">
                            {formData.image ? "CAMBIAR IMAGEN" : "SELECCIONAR ARCHIVO"}
                        </label>
                        {formData.image && (
                            <div className="mt-6 relative h-48 w-32 mx-auto overflow-hidden rounded shadow-2xl border border-gray-800">
                                <img src={formData.image} alt="Previsualización" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={status.type === "loading"}
                        className="w-full bg-white text-black py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.98] disabled:bg-gray-800 shadow-xl"
                    >
                        {status.type === "loading" ? "PUBLICANDO..." : "CONFIRMAR PUBLICACIÓN"}
                    </button>
                </form>
            </div>
        </div>
    );
}