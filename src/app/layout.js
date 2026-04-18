import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Aquí importamos los componentes: 
import Header from "@/components/Header"; //Header
import Footer from "@/components/Footer"; //Footer


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
      <body className="...">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}