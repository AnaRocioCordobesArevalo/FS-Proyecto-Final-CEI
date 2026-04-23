import { connectDB } from "@/lib/mongoose"; //Conexión de la base de datos
import Users from "@/models/Users"; //modelo de usuarios, es decir, la tabla de la base de datos
import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP
import bcrypt from "bcryptjs"; //para que no se vea la contraseña 
// He separado la parte del GET  y POST por una parte, pero, por otra he puesto el PUT y DELETE
// Buscar todos los usuarios
export async function GET() {
    try {
        await connectDB(); //para encontrar los usuarios y sería lo suyo hacer 2 cruds diferentes, pero, de momento no
        const users = await Users.find({});
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            //En el caso de tener error al cargar los usuarios 
            { error: "Error al cargar los usuarios" }, //Manejo de errores
            { status: 500 }
        );
    }
}

// Crear un usuario
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json(); 
        const salt = await bcrypt.genSalt(10); //el salt es la rebujina o el relleno
        const hashedPassword = await bcrypt.hash(body.password, salt);// El hash pilla la contraseña y la hace en texto plano. 
        // El resultado es una huella digital única con la combinación de salt y hash.
        const newUser = await Users.create({  //Tabla de la base de datatos, es decir, la estructura
            name: body.name,
            email: body.email,
            password: hashedPassword,
            is_admin: body.is_admin,
        });
        return NextResponse.json(newUser, { status: 201 });
        //En el caso de error
    } catch (error) {
        return NextResponse.json(
            //En el caso de que haya error al guardar 
            { error: `Error al guardar: ${error.message}` }, //Manejo de errores
            { status: 500 }
        );
    }
}