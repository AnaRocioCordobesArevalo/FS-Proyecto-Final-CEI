import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongoose";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    // Buscar el usuario por email
                    const user = await Users.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("Email no registrado");
                    }

                    // Verificar la contraseña
                    const passwordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (!passwordMatch) {
                        throw new Error("Contraseña incorrecta");
                    }

                    // Devolver los datos del usuario
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        is_admin: user.is_admin
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        // Añadir datos extra al token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.is_admin = user.is_admin;
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
        signIn: "/login" // página de login personalizada que haremos después
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };