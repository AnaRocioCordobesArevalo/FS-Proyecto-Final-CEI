// importación de la conexión de mongoose
import {connectDB} from "@/lib/mongoose";
// importación del modelo en este caso de los usuarios
import User from "@/models/User";
import { NextResponse } from "next/server";

// Empezamos el crud y se va dividir en 2 para que en una parte 
// se pueda buscar un usuario y en otro crud otros usuarios

//Buscar usuario
export async function GET() {
    try{
        await connectDB();
        const users = await User.find({});
        
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Error al cargar los usuarios'}, {status: 500});
    }
}
// Crear usuario
export async function POST(){
    try{
        await connectDB();
        const body = await request.json();
        //la estructura de lo que tiene que crear en caso de usuarios 
        const newUser = await User.create({name: body.name, email: body.email, password: body.password})
        return NextResponse.json(newUser)
    } catch (error){ //Mensaje de error al guardar
        return NextResponse.json({error: 'Error al guardar'})
    }
}