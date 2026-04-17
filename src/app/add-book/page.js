"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
    const [categories, setCategories] = useState([]); // Para el select
    const [status, setStatus] = useState({ type: "", message: "" }); // Para avisos
    const [formData, setFormData] = useState({
        tittle: "",
        author: "",
        category: "",
        image: "" // Aquí guardaremos el Base64
    });
    
    const router = useRouter();

    // 1. CARGAR CATEGORÍAS (Esto es lo que te había desaparecido)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                // Si la respuesta es un array, lo guardamos
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // 2. FUNCIÓN PARA PROCESAR LA IMAGEN
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result }); // Guarda el texto de la imagen
            };
            reader.readAsDataURL(file);
        }
    };

    // 3. ENVIAR FORMULARIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "loading", message: "Publicando libro..." });

        try {
            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ type: "success", message: "¡Libro publicado con éxito!" });
                setTimeout(() => router.push("/books"), 2000);
            } else {
                const data = await res.json();
                setStatus({ type: "error", message: data.error || "Error al publicar" });
            }
        } catch (error) {
            setStatus({ type: "error", message: "Error de conexión" });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Añadir Libro</h1>

                {/* Mensaje de estado */}
                {status.message && (
                    <div className={`mb-4 p-3 rounded text-sm text-center ${
                        status.type === "success" ? "bg-green-100 text-green-700" : 
                        status.type === "error" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        className="w-full border p-2 rounded text-black" 
                        placeholder="Título" 
                        onChange={e => setFormData({...formData, tittle: e.target.value})} 
                        required 
                    />

                    <input 
                        className="w-full border p-2 rounded text-black" 
                        placeholder="Autor" 
                        onChange={e => setFormData({...formData, author: e.target.value})} 
                        required 
                    />

                    {/* SELECCIÓN DE CATEGORÍA */}
                    <select 
                        className="w-full border p-2 rounded text-black"
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        required
                        value={formData.category}
                    >
                        <option value="">Selecciona Categoría</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* SELECCIÓN DE IMAGEN */}
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Portada del libro</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="text-xs text-gray-500"
                        />
                        {formData.image && (
                            <img src={formData.image} alt="Previsualización" className="mt-4 h-32 mx-auto rounded shadow" />
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
                    >
                        {status.type === "loading" ? "Cargando..." : "Publicar ahora"}
                    </button>
                </form>
            </div>
        </div>
    );
}