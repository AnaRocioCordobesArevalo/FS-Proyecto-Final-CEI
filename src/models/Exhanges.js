//Importamos el mongoose 
import mongoose from "mongoose";
//Tabla de la base de datos para el intermcambio de libros
const exchangeSchema = new mongoose.Schema({
    // Usuario que ofrece el intercambio
    user_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    // Usuario que recibe la solicitud
    user_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    // Libro que ofrece user_from
    book_offered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: true
    },
    // Libro que quiere a cambio
    book_requested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: true
    },
    // Estado del intercambio
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"],
        default: "pending"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

//Tabla donde te lo guarda  o que crea el modelo
export default mongoose.models.Exchange || mongoose.model("Exchange", exchangeSchema);