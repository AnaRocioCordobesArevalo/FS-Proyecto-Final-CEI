import { connectDB } from "@/lib/mongoose"; //La conexión de la base de datos, es decir, el mongoose
import Books from "@/models/Books"; //Los modelos de los libros de la base de datos
import Category from "@/models/Category";//Los modelos de las categorias de la base de datos
import Users from "@/models/Users"; // Importante para buscar un dueño
import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP
//Definimos la función POST para publicar
export async function POST(request) {
    try { //Se conecta con el Mongo (Base de datos)
        await connectDB();
        const body = await request.json();
        // Buscamos a los usuarios para que sea el dueño
        const someUser = await Users.findOne({});
        if (!someUser) {
            return NextResponse.json({ error: "No hay usuarios en la DB" }, { status: 500 });
        }
        // Creamos los libros
        const newBook = await Books.create({
            tittle: body.tittle, 
            author: body.author,   //Todo el cuerpo de la base de datos de libros (Books)
            category: body.category,
            image: body.image,     
            description: body.description || "",
            owner: someUser._id, 
            status: "disponible"
        });
        return NextResponse.json(newBook, { status: 201 });
    } catch (error) { //Manejo de errores 
        //Lanza el error de que no se ha guardado
        return NextResponse.json({ error: `Error al guardar: ${error.message}` }, { status: 500 });
    }
}
//Busqueda de libros
export async function GET() {
    await connectDB();
    const books = await Books.find({}).populate("category").populate("owner", "name");
    return NextResponse.json(books);
}