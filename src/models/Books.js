//Importamos mongoose
import mongoose from "mongoose";
//Estructura de la base de datos
const booksSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: [true, "El título es obligatorio"],
        minlength: [2, "El título debe tener mínimo 2 caracteres"],
        maxlength: [100, "El título no puede superar 100 caracteres"],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "La categoría es obligatoria"]
    },
    author: {
        type: String,
        required: [true, "El autor es obligatorio"],
        minlength: [3, "El autor debe tener mínimo 3 caracteres"],
        maxlength: [50, "El autor no puede superar 50 caracteres"],
        trim: true
    }
});
//Tabla donde te lo guarda  o que crea el modelo
export default mongoose.models.Books || mongoose.model("Books", booksSchema);