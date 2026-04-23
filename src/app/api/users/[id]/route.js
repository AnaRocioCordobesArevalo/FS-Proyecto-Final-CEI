import { connectDB } from "@/lib/mongoose";//Los modelos de los libros de la base de datos
import Users from "@/models/Users";//Los modelos de los usuarios de la base de datos
import Books from "@/models/Books"; //Los modelos de los libros de la base de datos
import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP

// Actualizar estado -> PUT /api/users/id 
// Es importante poner en el Postman: la url/api/users/id para que busque desde la id y actualice
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        //Obtener el usuario que hace la petición (inyectado por tu proxy)
        const userData = request.headers.get("user");
        //En el caso de que no se  haya autentificado
        if (!userData) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        const currentUser = JSON.parse(userData);
        // Seguridad: Solo el dueño del perfil o un Admin pueden editar
        if (currentUser.id !== id && !currentUser.is_admin) {
            //En el caso de que no este autorizado
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }
        //Preparar datos a actualizar (evitamos que un usuario normal se haga admin a sí mismo)
        const updateData = {
            name: body.name,
            email: body.email,
        };
        if (body.password) updateData.password = body.password;
        // Solo un admin puede cambiar el rango de is_admin
        if (currentUser.is_admin) updateData.is_admin = body.is_admin;
        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        //En el caso de que no se haya encontrado el usuario
        if (!updatedUser) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }); //Manejo de errores
        return NextResponse.json(updatedUser);
    } catch (error) { //En el caso de que no se pueda actualizar
        return NextResponse.json({ error: `Error al actualizar: ${error.message}` }, { status: 500 }); //Manejo de errores
    }
}
// Cancelar/borrar intercambio ->DELETE /api/users/id
// Es importante poner en el Postman: la url/api/users/id para que busque desde la id y borre
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        // Validar quién intenta borrar
        const userData = request.headers.get("user");
        //En el caso de que no se haya autentificado
        if (!userData) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        const currentUser = JSON.parse(userData);
        //Seguridad: Solo Admin o el propio usuario
        if (currentUser.id !== id && !currentUser.is_admin) { 
            //En el caso de que no se tenga permisos
            return NextResponse.json({ error: "No tienes permisos" }, { status: 403 }); 
        }
        //BORRADO EN CASCADA: Borramos sus libros antes que al usuario
        await Books.deleteMany({ owner: id });
        //Borrar el usuario
        const deletedUser = await Users.findByIdAndDelete(id); //Busca por el id y luego lo borrar
        //En el caso de que no se  
        if (!deletedUser) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }); //Manejo de errores 
        //En el caso de que se haya eliminado correctamente el usuario y el libro
        return NextResponse.json({ message: "Usuario y sus libros eliminados correctamente" });
    } catch (error) { //En el caso de que haya un errore al borrar
        return NextResponse.json({ error: `Error al borrar: ${error.message}` }, { status: 500 }); //Manejo de errores 
    }
}