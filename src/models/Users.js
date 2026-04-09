//importamos mongoose para que se conecte con el modelo
import mongoose from "mongoose";
//Como vamos a estructurar la base de datos, es decir, el modelo
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        unique: true
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
        
    }
});
//Tabla donde te lo guarda  o que crea el modelo
export default mongoose.models.Users || mongoose.model ("Users", usersSchema);