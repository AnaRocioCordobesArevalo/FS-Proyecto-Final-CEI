//La importaciones tanto de la conexión de mongoose, como de los modelos y del server.
import { connectDB } from "@/lib/mongoose"; //La conexión de la base de datos, es decir, el mongoose
import Category from "@/models/Category"; //Los modelos de las categorias de la base de datos
import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP

//Para buscar la categoria
export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({}); //Para que busqie 
        return NextResponse.json(categories);
    } catch (error) { //En el caso de que haya un error al cargar las categorias 
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
    } catch (error) { //En el caso de que haya un error al guardar 
        return NextResponse.json(
            { error: `Error al guardar: ${error.message}` },
            { status: 500 } //Manejo de errores
        );
    }
}