import { connectDB } from "@/lib/mongoose";//La conexión con el mongoose
import Users from "@/models/Users";// El modelo de usuario, que necesitamos
import { NextResponse } from "next/server";//El motor principal qe gestiona las rutas de autenticación
import bcrypt from "bcryptjs";  //Libreria para comprar contraseñas encriptadas
import jwt from "jsonwebtoken"; // JSON Web Token (JWT)

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // Buscar el usuario por email
        const user = await Users.findOne({ email: body.email });
        if (!user) {
            return NextResponse.json(
                { error: "Email no registrado" }, // Manejo de errores 
                { status: 401 }
            );
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            return NextResponse.json( //Manejo de errores 
                { error: "Contraseña o correo incorrecto" },
                { status: 401 }
            );
        }

        // Crear el token JWT
        const token = jwt.sign(
            {
                id: user._id, //el modelo de usuario
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            },
            process.env.NEXTAUTH_SECRET, //lo que tenemos en .env
            { expiresIn: "24h" } //el tiempo que expira el token
        );

        return NextResponse.json({
            message: "Login correcto", //Lo que tiene que devolver si está todo correcto 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) { //Manejo de errores 
        return NextResponse.json(
            { error: `Error al hacer login: ${error.message}` },
            { status: 500 }
        );
    }
}