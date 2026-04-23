"use client"; //Para los hooks 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Hook para redirigir al usuario 

export default function AddBookPage() {
    const [categories, setCategories] = useState([]); //Guardar las categorias que tiene mongoose 
    const [status, setStatus] = useState({ type: "", message: "" }); // Para mostrar que está cargando la página, hubo error o éxito
    const [formData, setFormData] = useState({ // El "paquete" de datos que enviaremos
        tittle: "",
        author: "",
        category: "", //La base de la datos, el de libros (books)
        image: "" // Aqui guardaremos la imagen convertido a texto (BASE64)-está parte ha sido complicada
    });
    const router = useRouter(); //El Hook
    // Efecto de Carga Inicial
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories"); //Petición de la api de categorias 
                const data = await res.json();
                //Validamos que la respuesta sea un array antes de guardarla
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
                setCategories([]);
            }
        };
        fetchCategories();
        //El array vacio, que asegura que esto solo ocurra una vez al cargar la página
    }, []);
    // Manejo de la Imagen- Zona compleja
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Captura el primer archivo seleccionado 
        if (file) {
            const reader = new FileReader();//Lectura
            reader.onloadend = () => {
                //Cuando termina de leer, se guarda el resultado, es decir, (BASE64) en el estado formData
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file); //Dispara la conversión del archivo a una URL de datos
        }
    };
    //El envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); //Evita que la página se recargue al enviar el form
        setStatus({ type: "loading", message: "PUBLICANDO EJEMPLAR..." });
        try {
            const res = await fetch("/api/books", {
                method: "POST",//Metodo para crear recursos
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData) //Enviamos todo el objeto formData como JSON
            });
            if (res.ok) { //Si funciona y aparece de que se ha añadido a la colección
                setStatus({ type: "success", message: "¡LIBRO AÑADIDO A LA COLECCIÓN <3!" }); //Si se ha añadido el libro
                setTimeout(() => router.push("/books"), 2000);
            } else { //En el caso contrario de que no se haya añadido, pues aparece el error de que no se ha podido publicar
                const data = await res.json();
                setStatus({ type: "error", message: data.error || "ERROR AL PUBLICAR :(" }); //Si da error al publicar
            }
        } catch (error) { //Manejo de errores por si no hay conexión
            setStatus({ type: "error", message: "ERROR DE CONEXIÓN :´(" }); //Si explota todo
        }
    };
    //FRONTED
    return (
        //Formulario para agregar o publicar libros, una vez, que estas loguead@
        <div className="flex min-h-screen items-center justify-center bg-black p-4 md:p-10">
            {/* Ancho completo en móviles, máximo lg en pantallas grandes */}
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-gray-900 p-6 md:p-12 rounded-2xl shadow-2xl">
                {/* TÍTULO  */}
                <div className="text-left mb-8 md:mb-12 border-l border-white pl-4 md:pl-6">
                    <h1 className="font-serif-logo text-2xl md:text-4xl mb-1 text-white italic">Publicar</h1>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">
                        Añade una nueva historia
                    </p> {/*Es decir un librito*/}
                </div>
                {/* Mensajito, en otras palabras, si se ha agregado en verde,
                pero, en el caso de que no se haya agregado pues aparece en rojo*/}
                {status.message && (
                    <div className={`mb-6 p-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-center border ${status.type === "success" ? "border-green-900/30 bg-green-950/10 text-green-500" :
                            status.type === "error" ? "border-red-900/30 bg-red-950/10 text-red-500" : "border-gray-800 bg-gray-900 text-gray-400"
                        }`}>
                        {status.message}
                    </div>
                )}
                {/*Aqui ponemos el libro  que queremos publicar*/}
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    <div className="group">
                        <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">Título</label>
                        <input
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900"
                            placeholder="EJ: CRÓNICA DE UNA MUERTE ANUNCIADA" //Ejemplo de libro
                            onChange={e => setFormData({ ...formData, tittle: e.target.value })}
                            required
                        />
                    </div>
                    {/*Aqui ponemos ponemos el autor*/}
                    <div className="group">
                        <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">Autor</label>
                        <input
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-white placeholder:text-gray-900"
                            placeholder="GABRIEL GARCÍA MÁRQUEZ"  //Ejemplo de autor
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            required
                        />
                    </div>
                    <div className="group">
                        <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black mb-2">Categoría</label>
                        <select
                            className="w-full bg-transparent border-b border-gray-800 py-2 outline-none focus:border-white transition-colors text-sm text-gray-400 cursor-pointer"
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            required
                            value={formData.category}
                        >
                            <option value="" className="bg-black text-white italic">SELECCIONA UNA CATEGORÍA</option> {/*Seleccionar en que categoria, 
                            aunque, ahora solo se puede seleccionar una */}
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id} className="bg-black text-white uppercase">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* SELECCIÓN DE IMAGEN RESPONSIVE (FUNCIONA)*/}
                    <div className="border border-dashed border-gray-800 p-4 md:p-8 rounded-lg text-center bg-black/40 group hover:border-gray-600 transition-colors">
                        <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4 cursor-pointer">
                            Subir Portada
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer text-[9px] md:text-[11px] text-gray-600 hover:text-white transition-colors font-bold uppercase tracking-widest">
                            {formData.image ? "Cambiar Imagen" : "Seleccionar Archivo"}
                        </label>
                        {formData.image && (
                            <div className="mt-6 relative h-40 w-28 md:h-52 md:w-36 mx-auto overflow-hidden rounded shadow-2xl border border-gray-900">
                                <img src={formData.image} alt="Previsualización" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={status.type === "loading"}
                        className="w-full bg-white text-black py-4 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.96] disabled:bg-gray-800 shadow-xl"
                    >
                        {status.type === "loading" ? "Publicando..." : "Confirmar Publicación"}
                    </button>
                </form>
            </div>
        </div>
    );
}