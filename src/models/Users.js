//Importamos mongoose
import mongoose from "mongoose";
//Estructura de la base de datos
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        minlength: [3, "El nombre debe tener mínimo 3 caracteres"],
        maxlength: [50, "El nombre no puede superar 50 caracteres"],
        trim: true // elimina espacios al inicio y al final
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        trim: true,
        lowercase: true, // convierte a minúsculas automáticamente
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, //Esto me ha ayudado la IA
            "El email no tiene un formato válido"
        ]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [8, "La contraseña debe tener mínimo 8 caracteres"],
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
    }
});
//Tabla donde te lo guarda  o que crea el modelo
export default mongoose.models.Users || mongoose.model("Users", usersSchema);