//conexión con el mongoose
import mongoose from "mongoose";
//Tabla de la base de datos
const booksSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    author: {
        type: String,
        required: true
    }
});
//Tabla donde te lo guarda  o que crea el modelo
export default mongoose.models.Books || mongoose.model("Books", booksSchema);