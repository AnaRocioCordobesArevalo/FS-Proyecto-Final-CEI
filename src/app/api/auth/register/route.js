import { connectDB } from "@/lib/mongoose"; //conexión con mongoose
import Users from "@/models/Users"; //modelo de usuario
import { NextResponse } from "next/server"; //la lógica 
import bcrypt from "bcryptjs"; //para que no se vea la contraseña 

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        //Validar que el email no exista ya
        const emailNormalizado = body.email.toLowerCase().trim();
        const existingUser = await Users.findOne({ email: emailNormalizado });
        //En el caso de que exista el correo 
        if (existingUser) {
            return NextResponse.json( //Manejo de errores 
                { error: "El email ya está registrado" },
                { status: 400 }
            );
        }

        //ENCRIPTAR la contraseña (El paso clave)
        // Usamos un "salt" de 10 para que sea seguro pero rápido
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        //Crear el usuario con la contraseña encriptada
        const newUser = await Users.create({
            name: body.name,
            email: emailNormalizado,
            password: hashedPassword, // <--- Guardamos el hash ($2a$...)
            is_admin: false
        });

        //Respuesta de éxito (sin enviar la contraseña de vuelta)
        const { password, ...userWithoutPassword } = newUser.toObject();

        return NextResponse.json(
            { message: "Usuario creado correctamente", user: userWithoutPassword },
            { status: 201 } //Para que salga que se ha hecho el proceso correctamente 
        );

    } catch (error) { //En el caso de que haya un error
        return NextResponse.json(
            { error: `Error al registrar: ${error.message}` },
            { status: 500 } //Manejo de errores 
        );
    }
}