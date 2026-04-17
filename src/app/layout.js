import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Importamos tus componentes (asegúrate de que las rutas sean correctas)
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mi Proyecto Final",
  description: "App de gestión de libros y categorías",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning> 
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}