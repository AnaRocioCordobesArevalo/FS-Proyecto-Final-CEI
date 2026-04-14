import { NextResponse } from "next/server";   //Permite definir una lógica 

//Escribe que se ha cerrado  
export async function POST() {
    return NextResponse.json(
        { message: "Logout correcto" },
        { status: 200 }
    );
}