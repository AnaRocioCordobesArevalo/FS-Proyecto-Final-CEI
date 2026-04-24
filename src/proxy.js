import { NextResponse } from "next/server"; //Herramienta para enviar respuestas HTTP
// En src/proxy.js o src/middleware/proxy.js
import { authMiddleware, adminMiddleware } from "@/middlewares/auth"; // Enseña las credenciales y el permiso de administrador para entrar


/*LISTAS DE ACCESO */
// Páginas que requieren inicio de sesión
const protectedPages = ["/books", "/add-book", "/profile", "/exchanges"];
// Rutas de API que requieren Token de usuario normal
const protectedApiRoutes = ["/api/exchanges", "/api/categories", "/api/books" , "/api/auth/me" ]; 
// Rutas de API que requieren Token de Administrador
const adminApiRoutes = ["/api/users"];
export async function proxy(request) {
    const { pathname } = request.nextUrl;
    //PROTECCIÓN DE PÁGINAS(Frontend)
    // Verificamos si la ruta actual es una de las páginas protegidas
    const isProtectedPage = protectedPages.some(route => pathname.startsWith(route));
    if (isProtectedPage) {
        // En el frontend, el Middleware lee el token de las cookies
        const token = request.cookies.get("token")?.value;
        if (!token) {
            // Si no hay token, redirigimos al Login
            const loginUrl = new URL("/login", request.url);
            // Opcional: guardamos la ruta a la que quería ir para volver luego
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }
    // PROTECCIÓN DE API (Backend) 
    const isProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route));
    const isAdminApi = adminApiRoutes.some(route => pathname.startsWith(route));
    // Si es una ruta de API para administradores
    if (isAdminApi) {
        return await adminMiddleware(request);
    }
    // Si es una ruta de API para usuarios logueados
    if (isProtectedApi) {
        return await authMiddleware(request);
    }
    // Si no es ninguna de las anteriores 
    return NextResponse.next();
}
/**
 * CONFIGURACIÓN DEL MATCHER (ESTO ES COMPLICADO)
 * Define qué rutas activarán este archivo y está parte me ha costado trabajo 
 */
export const config = {
    matcher: [
        
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};