import { connectDB } from "@/lib/mongoose"; //La conexión a mongoose
import Users from "@/models/Users"; //La importación de los modelos 
import { NextResponse } from "next/server"; //Permite definir una lógica del registro
import bcrypt from "bcryptjs"; //Libreria para comprar contraseñas encriptadas


//Para crear un registro necesitamos el POST, aunque, podemos mirarlo antes en el GET
export async function POST(request) { //La peticiones 
    try {
        await connectDB();
        const body = await request.json(); 

        // Verificar si el email ya existe
        const existingUser = await Users.findOne({ email: body.email }); //compara
        if (existingUser) {
            return NextResponse.json(
                { error: "El email ya está registrado" }, //Lo que devuelve en el caso de que tengamos registrado ese email
                { status: 400 } //Manejo de errores 
            );
        }

        // Encriptar la contraseña (taparlo con puntitos)
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Crear el usuario con la contraseña encriptada
        const newUser = await Users.create({
            name: body.name, //modelo
            email: body.email,
            password: hashedPassword,
            is_admin: false // por defecto no es admin
        });

        // No devolver la contraseña en la respuesta
        const { password, ...userWithoutPassword } = newUser.toObject();

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al registrar: ${error.message}` },
            { status: 500 } //Manejo de errores 
        );
    }
}