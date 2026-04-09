//importamos mongoose para que se conecte con el modelo
import mongoose from "mongoose";
//tabla de base de datos
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});
//Tabla donde te lo guarda  o que crea el modelo
export default mongoose.models.Category || mongoose.model("Category", categorySchema);