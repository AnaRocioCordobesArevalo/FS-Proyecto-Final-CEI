import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP
import { connectDB } from "@/lib/mongoose"; //La conexión de la base de datos, es decir, el mongoose
import Users from "@/models/Users";//Los modelos de los usuarios de la base de datos
import { jwtVerify } from "jose"; // Libreria para crear y firmar JSON web Tokens.
//Definimos la función GET 
export async function GET(request) {
    try {
        await connectDB();

        // El middleware ya verificó el token y puso el payload aquí
        const userHeader = request.headers.get("user");

        if (!userHeader) { //En el caso de que no este autorizado el usuario
            return NextResponse.json({ error: "No autorizado" }, { status: 401 }); //Manejo de errores 
        }

        const payload = JSON.parse(userHeader);
        const user = await Users.findById(payload.id).select("-password");

        if (!user) { //En el caso de que no se haya encontrado al usuario
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }); //Manejo de errores 
        }

        return NextResponse.json({ user });

    } catch (error) {
        console.error("Error en /api/auth/me:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 }); //Manejo de errores 
    }
}