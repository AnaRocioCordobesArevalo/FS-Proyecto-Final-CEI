import { Geist, Geist_Mono } from "next/font/google"; // Importación de fuentes optimizadas de Google
import "./globals.css"; //Estilos globales
import Header from "@/components/Header"; // Componente de navegación superior
import Footer from "@/components/Footer"; // Componente de pie de página

//Definir las variables de las fuentes 
const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
//METADATOS SEO
export const metadata = {
  title: "Metamorfosis",
  description: "Página de intercambio de libros",
};
//ROOT LAYOUT
export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <Header />  {/*Componente*/}
        <main className="flex-grow">{children}</main>
        <Footer /> {/*Componente*/}
      </body>
    </html>
  );
}