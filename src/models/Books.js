// Importamos mongoose
import mongoose from "mongoose";

// Estructura de la base de datos
const booksSchema = new mongoose.Schema({
    tittle: { //Titulos
        type: String,
        required: [true, "El título es obligatorio"],
        minlength: [2, "El título debe tener mínimo 2 caracteres"],
        maxlength: [100, "El título no puede superar 100 caracteres"],
        trim: true
    },
    category: { //Categoria 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "La categoría es obligatoria"]
    },
    author: {  //Autor
        type: String,
        required: [true, "El autor es obligatorio"],
        minlength: [3, "El autor debe tener mínimo 3 caracteres"],
        maxlength: [50, "El autor no puede superar 50 caracteres"],
        trim: true
    },
    image: { //Imageenes 
        type: String, //Para que se pueda subir las fotos en el perfil
        required: true // Puedes cambiarlo a true si quieres que la foto sea obligatoria
    },
    owner: { //Propiedad 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users",
        required: true  
    },
    status: {
        type: String, //Estado
        enum: ["disponible", "intercambiado", "reservado"],
        default: "disponible"
    }
}, { 
    timestamps: true // Esto añade automáticamente campos de "creado el" y "actualizado el"
});

// Tabla donde te lo guarda o que crea el modelo
export default mongoose.models.Books || mongoose.model("Books", booksSchema);