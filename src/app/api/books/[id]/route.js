import { connectDB } from "@/lib/mongoose"; //La conexión de la base de datos, es decir, el mongoose
import Books from "@/models/Books";//Los modelos de los libros de la base de datos
import { NextResponse } from "next/server";//Herramienta para enviar respuestas HTTP
//Definimos la función DELETE
export async function DELETE(request, { params }) {
    try { //Se conecta con el Mongo (Base de datos)
        await connectDB();
        const { id } = await params; //Obtenemos la ID de los libros
        //El Middleware/Proxy ya procesó el token
        const userData = request.headers.get("user");
        if (!userData) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const user = JSON.parse(userData);
        //Buscamos el libro por la id
        const book = await Books.findById(id);
        if (!book) { //En el caso de que no se encuente el libro, pues manda un mensaje
            return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
        }
        // LA KEY: Si es admin, pasa. Si no, debe ser el dueño.
        const isOwner = book.owner.toString() === user.id;
        const isAdmin = user.is_admin === true;
        if (!isOwner && !isAdmin) { //En el caso de que usuario ordinario, pues no puede borrar el libro, en caso de que no sea admin
            return NextResponse.json(
                { error: "Permisos insuficientes para borrar este libro" }, //Manejo de errores 
                { status: 403 }
            );
        }
        await Books.findByIdAndDelete(id); //Cuando se completa la eliminación
        return NextResponse.json({ message: "Metamorfosis completada: Libro eliminado" });
    } catch (error) { //Cuando no
        return NextResponse.json(
            { error: `Error en el borrado: ${error.message}` }, //Manejo de errores 
            { status: 500 }
        );
    }
}