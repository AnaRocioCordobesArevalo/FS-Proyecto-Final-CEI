//importamos mongoose para que se conecte con el modelo
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
//Tabla donde te lo guarda 
export default mongoose.models.User || mongoose.model ("User", userSchema);