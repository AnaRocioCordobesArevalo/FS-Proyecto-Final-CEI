import { NextResponse } from "next/server";   //Herramienta para enviar respuestas HTTP

//Escribe que se ha cerrado  
export async function POST() {
    return NextResponse.json(
        { message: "Logout correcto" },
        { status: 200 }
    );
}