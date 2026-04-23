//La importaciones tanto de la conexión de mongoose, como de los modelos y del server.
import { connectDB } from "@/lib/mongoose";//Los modelos de los libros de la base de datos
import Exchange from "@/models/Exchange"; //Los modelos de los intercambios de la base de datos
import Users from "@/models/Users"; //Los modelos de los usuarios de la base de datos
import Books from "@/models/Books"; //Los modelos de los libros de la base de datos
import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP


//La busqueda de los intercambios que se hace
export async function GET() {
    try {
        await connectDB();
        const exchanges = await Exchange.find({}) //Para que busque 
            .populate("user_from", "name email") // El modelo de la tabla
            .populate("user_to", "name email")
            .populate("book_offered", "tittle author")
            .populate("book_requested", "tittle author");
        return NextResponse.json(exchanges);
    } catch (error) { //Manejo de errores 
        return NextResponse.json(
            //En el caso de que no se pueda cargar los intercambios
            { error: "Error al cargar los intercambios" },
            { status: 500 }
        );
    }
}
//Crear intercambio para luego verlo en el GET
export async function POST(request) { //el request para las peticiones 
    try {
        await connectDB();
        const body = await request.json();
        const newExchange = await Exchange.create({  //el modelo de la tabla
            user_from: body.user_from,
            user_to: body.user_to,
            book_offered: body.book_offered,
            book_requested: body.book_requested,
        });
        return NextResponse.json(newExchange, { status: 201 });
    } catch (error) { //Manejo de errores
        return NextResponse.json(
            //En el caso de que haya un error 
            { error: `Error al crear intercambio: ${error.message}` }, //Manejo de errores 
            { status: 500 }
        );
    }
}