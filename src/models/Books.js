//importamos mongoose para que se conecto con el modelo
import mongoose, { trusted } from "mongoose";

const booksSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

//Tabla donde te lo guarda
export default mongoose.models.Books || mongoose.model ("Books", booksSchema);

