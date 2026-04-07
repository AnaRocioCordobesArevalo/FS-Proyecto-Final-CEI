/* Aquí hay que poner toda la parte del CRUD para manejar todo el resto de los usuarios  */
// importación de la conexión de mongoose
import {connectDB} from "@/lib/mongoose";
// importación del modelo en este caso de los libros
import Books from "@/models/Books";
import { NextResponse } from "next/server";

// Empezamos el crud y se va dividir en 2 para que en una parte 
// se pueda buscar un usuario y en otro crud otros libros

//Buscar usuario
export async function GET() {
    try{
        await connectDB();
        const Books = await Books.find({});
        
        return NextResponse.json(Books);
    } catch (error) {
        return NextResponse.json({ error: 'Error al cargar los libros'}, {status: 500});
    }
}
// Crear books
export async function POST(){
    try{
        await connectDB();
        const body = await request.json();
        //la estructura de lo que tiene que crear en caso de usuarios 
        const newUser = await Books.create({tittle: body.tittle, category: body.category, author: body.author})
        return NextResponse.json(newUser)
    } catch (error){ //Mensaje de error al guardar
        return NextResponse.json({error: 'Error al guardar'})
    }
}
export async function PUT(){
    try{
        await connectDB();
        const body = await request.json();
        //la estructura de lo que tiene que crear en caso de libros
        const newUser = await Books.create({tittle: body.tittle, category: body.category, author: body.author})
        return NextResponse.json(newUser)
    } catch (error){ //Mensaje de error al guardar
        return NextResponse.json({error: 'Error al guardar'})
    }
}
export async function DELETE(){
    try{
        await DELETE();
        const body = await request.json();
        //la estructura de lo que tiene que crear en caso de usuarios 
        const newUser = await Books.create({tittle: body.tittle, category: body.category, author: body.author})
        return NextResponse.json(newUser)
    } catch (error){ //Mensaje de error al guardar
        return NextResponse.json({error: 'Error al guardar'})
    }
}