import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP
import { jwtVerify } from "jose"; // Importa la función para validar la autencidad, firma y el tiempo que caduca 

/**
 * FUNCIÓN PRIVADA: Extrae y verifica el JWT- El dolor de cabeza que me ha dado esto
 * 
 */

//Verifica la moneda  
    async function verifyToken(request) { //la petición 
    const authHeader = request.headers.get("authorization");

    // Intenta obtener el token del Header (para peticiones fetch/API)
    let token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // En el caso que no haya, lo buscamos en las Cookies (para navegación de páginas)
    if (!token) {
        token = request.cookies.get("token")?.value;
    }

    if (!token) return null; //nulo

    try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) { //Manejo de errores 
        console.error("JWT Verification Error:", error.message);
        return null;
    }
}

/**
 * MIDDLEWARE PARA USUARIOS AUTENTICADOS
 */
    export async function authMiddleware(request) {
    const payload = await verifyToken(request);

    if (!payload) {
        // Si es una petición de API, devolvemos JSON
        if (request.nextUrl.pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Token inválido o requerido" }, { status: 401 });
        }
        // Si es una página, el proxy se encargará de la redirección, 
        // pero aquí retornamos null para indicar fallo.
        return null;
    }

    // Inyectamos los datos del usuario en los headers para que la API pueda usarlos
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(payload));

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

/**
 * MIDDLEWARE PARA ADMINISTRADORES- Espero que funcione
 */
    export async function adminMiddleware(request) {
    const payload = await verifyToken(request);

    if (!payload || !payload.is_admin) {
        if (request.nextUrl.pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Acceso denegado: Se requiere admin" }, { status: 403 });
        }
        return null; // retorna nulo 
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify(payload));

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}