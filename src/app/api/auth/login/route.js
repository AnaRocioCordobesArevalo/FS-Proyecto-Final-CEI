import { connectDB } from "@/lib/mongoose";//La conexión con el mongoose
import Users from "@/models/Users";// El modelo de usuario, que necesitamos
import { NextResponse } from "next/server";//El motor principal qe gestiona las rutas de autenticación
import bcrypt from "bcryptjs";  //Libreria para comprar contraseñas encriptadas
import { SignJWT } from "jose"; //Libreria de Jose


export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Buscar el usuario por email
        const user = await Users.findOne({ email: body.email.toLowerCase().trim() });
        if (!user) {
            return NextResponse.json(
                { error: "Email no registrado" }, 
                { status: 401 } //Manejo de errores 
            );
        }

        // Verificar la contraseña (Bcrypt)
        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            return NextResponse.json( //Manejo de errores 
                { error: "Contraseña o correo incorrecto" },
                { status: 401 } 
            );
        }

        // 3. Crear el token JWT usando JOSE (Imprescindible para tu middleware)- no cambiarlo por otro para que no de problemas con el proxy
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const token = await new SignJWT({
                id: user._id.toString(),
                name: user.name,  //Modelo
                email: user.email,
                is_admin: user.is_admin
            })
            .setProtectedHeader({ alg: "HS256" }) // Definimos el algoritmo
            .setIssuedAt()
            .setExpirationTime("24h")       ///el tiempo que se caduca 
            .sign(secret);

        //Respuesta al frontend
        return NextResponse.json({
            message: "Login correcto",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,  //modelo que sigue, que tenemos en Users
                is_admin: user.is_admin
            }
        });
        //En el caso de que haya un error en el login 
    } catch (error) {
        return NextResponse.json(
            { error: `Error al hacer login: ${error.message}` },
            { status: 500 } //Manejo de errores 
        );
    }
}