import NextAuth from "next-auth"; //El motor principal qe gestiona las rutas de autenticación
import CredentialsProvider from "next-auth/providers/credentials"; //Permite definir una lógica propia de inciio de sesión
import { connectDB } from "@/lib/mongoose"; //La conexión con el mongoose
import Users from "@/models/Users"; // El modelo de usuario, que necesitamos
import bcrypt from "bcryptjs"; //Libreria para comprar contraseñas encriptadas

const handler = NextAuth({ // export { handler as GET, handler as POST };
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" } //modelo 
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    // Buscar el usuario por email
                    const user = await Users.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("Email no registrado"); //Manejo de errores 
                    }

                    // Verificar la contraseña
                    const passwordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!passwordMatch) { //En el caso de la contraseña sea incorrecta
                        throw new Error("Contraseña incorrecta");
                    }

                    // Devolver los datos del usuario
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        is_admin: user.is_admin
                    };
                } catch (error) { //Manejo de errores 
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        // Añadir datos extra al token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; //Token de la id
                token.is_admin = user.is_admin; //Token si es administrador o no 
            }
            return token;
        },
        // Añadir datos extra a la sesión
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.is_admin = token.is_admin;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login" // página de login personalizada que haremos después, es decir, el fronted 
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET // lo que tenemos en el .env
});

export { handler as GET, handler as POST };