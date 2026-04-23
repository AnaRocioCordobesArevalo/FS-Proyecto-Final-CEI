import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP
import { connectDB } from "@/lib/mongoose"; //La conexión de la base de datos, es decir, el mongoose
import Users from "@/models/Users";//Los modelos de los usuarios de la base de datos
import { jwtVerify } from "jose"; // Libreria para crear y firmar JSON web Tokens.
//Definimos la función GET 
export async function GET(request) {
    try { //Se conecta con el Mongo (Base de datos)
        await connectDB();
        // Obtener el token de la cookie 
        const token = request.cookies.get("token")?.value;
        //En el caso de que no este autorizado, pues 401
        if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        // --- FIRMA DEL TOKEN CON JOSE ---
        // La clase secreta de .env  se convierte en formato JOSE
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        // Creamos el payload del JWT (la información que viajará dentro del token)
        const { payload } = await jwtVerify(token, secret);
        //Buscamos al usuario en la DB incluyendo su nombre (todo)
        const user = await Users.findById(payload.id).select("-password");
        //En el caso de que no se haya encontrado, pues se lanza el siguiente mensaje
        if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        return NextResponse.json({ user });
    } catch (error) { //Manejo de errores 
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}