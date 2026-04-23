import { connectDB } from "@/lib/mongoose"; //La conexión de la base de datos, es decir, el mongoose
import Users from "@/models/Users";//Los modelos de los usuarios de la base de datos
import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP
import bcrypt from "bcryptjs"; //Libreria donde se comparan las contraseñas capadas o encriptadas.
import { SignJWT } from "jose"; // Libreria para crear y firmar JSON web Tokens.

// Definimos la función POST 
export async function POST(request) {
    try { //Se conecta con el Mongo (Base de datos)
        await connectDB();
        const { email, password } = await request.json(); //el cuerpo que pedimos para logear: email y contraseña.
        const user = await Users.findOne({ email: email.toLowerCase().trim() }); //Se busca por el email // Usamos .toLowerCase 
        // y el .trim para evitar errores de mayusculas o espacios accidentales
        //Si el usuario no existe, devolvemos error 401
        if (!user) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 }); //En el caso de que esté mal 
        //Comparamos la contraseña ingresada con la contraseña capada
        const isMatch = await bcrypt.compare(password, user.password);
        //Que no coincide, pues se lanza el error 401
        if (!isMatch) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        // --- FIRMA DEL TOKEN CON JOSE ---
        //La clase secreta de .env  se convierte en formato JOSE
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        // Creamos el payload del JWT (la información que viajará dentro del token)
        const token = await new SignJWT({
            id: user._id.toString(),
            email: user.email,
            is_admin: user.is_admin
        })
            .setProtectedHeader({ alg: "HS256" }) //Definimos el algoritmo de encriptación
            .setIssuedAt()              // Fecha de creación
            .setExpirationTime("24h")// Cuando caduca
            .sign(secret);             //Firma de nuestra clave
        //Devolvemos el token generado y los datos básicos del usuario para el frontend
        return NextResponse.json({
            token,
            user: { name: user.name, email: user.email, is_admin: user.is_admin }
        });
        //Manejo de errores 
    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}