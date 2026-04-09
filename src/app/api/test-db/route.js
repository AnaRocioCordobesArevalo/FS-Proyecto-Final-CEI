import { connectDB } from '@/lib/mongoose'; 
import mongoose from 'mongoose';
//Test porque no se conectaba a la base de datos, cuando estaba todo correcto y he tenido que generar una nueva conexión
export async function GET() {
    try {
        await connectDB();

        // Crear un modelo rápido para probar
        const TestSchema = new mongoose.Schema({ nombre: String });
        const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

        // Guardar un dato
        const dato = await Test.create({ nombre: "Prueba desde Next.js" });

        return new Response(JSON.stringify({ success: true, data: dato }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        //manejo de errores
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: error.message }), 
        {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

//Este test es para ver si se comunicaba bien los modelos y las conexiones, estaban bien. 
//Debido a que en mongoose compass, no me aparecia la tabla en el servidor y ni el local, por lo que con el test, verifique que
// lo que fallaba era mongoose