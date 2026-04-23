import { Geist, Geist_Mono } from "next/font/google"; // 1. Importar las fuentes
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

//Definir las variables de las fuentes (ESTO ES LO QUE FALTA)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Metamorfosis",
  description: "Página de intercambio de libros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <Header /> 
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}