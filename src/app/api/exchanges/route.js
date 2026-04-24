import { connectDB } from "@/lib/mongoose"; //Los modelos de los libros de la base de datos
import Exchange from "@/models/Exchange";//Los modelos de los intercambios de la base de datos
import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP

export async function GET() {
    try {
        await connectDB();
        const exchanges = await Exchange.find({}) 
            .populate("user_from", "name email") //Modelo de los intercambios
            .populate("user_to", "name email")
            .populate("book_offered", "tittle author")
            .populate("book_requested", "tittle author");
        return NextResponse.json(exchanges);
    } catch (error) { //En el caso de que haya un error para cargar los intercambios
        return NextResponse.json({ error: "Error al cargar los intercambios" }, { status: 500 });
    }
}
//Para crear el intercambio
export async function POST(request) {
    try {
        await connectDB();

        // Leer usuario logueado desde el middleware
        const userHeader = request.headers.get("user");
        if (!userHeader) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const payload = JSON.parse(userHeader);

        const body = await request.json();

        const newExchange = await Exchange.create({
            user_from: payload.id,        //siempre el usuario logueado
            user_to: body.user_to,
            book_offered: body.book_offered,
            book_requested: body.book_requested,
        });

        return NextResponse.json(newExchange, { status: 201 });
    } catch (error) { //En el caso de que haya un error al crear un intercambio
        return NextResponse.json({ error: `Error al crear intercambio: ${error.message}` }, { status: 500 });
        //Manejo de errores 
    }
}