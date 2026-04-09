//La importaciones tanto de la conexión de mongoose, como de los modelos y del server.
import { connectDB } from "@/lib/mongoose";
import Category from "@/models/Category"; 
import { NextResponse } from "next/server";

//Para buscar la categoria
export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({}); //Para que busqie 
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cargar las categorías" },
            { status: 500 } //Manejo de errores
        );
    }
}
//Primero tenemos que escribir la categoria en Postman y en este caso el nombre para que luego
//se genere un id por categoria y no haga falta enumerarla
export async function POST(request) { // Es importante el request para hacer las peticiones 
    try {
        await connectDB();
        const body = await request.json();
        const newCategory = await Category.create({
            name: body.name   //modelo creadeo
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}