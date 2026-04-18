"use client";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            
            {/* --- SECCIÓN HERO (IMPACTO VISUAL) --- */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden px-6">
                <div className="z-10 text-center">
                    <div className="mb-6 inline-block border border-gray-800 px-4 py-1 rounded-full">
                        <span className="text-[9px] uppercase tracking-[0.5em] text-gray-400 font-bold">
                            Nueva Era de Lectura
                        </span>
                    </div>
                    
                    <h1 className="font-serif-logo text-7xl md:text-9xl mb-8 tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Metamorfosis.
                    </h1>
                    
                    <p className="max-w-xl mx-auto text-gray-500 text-sm md:text-base leading-relaxed tracking-wide mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        No solo intercambiamos libros, transformamos historias. 
                        Únete a la comunidad de intercambio de libros más exclusiva y minimalista.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        <Link 
                            href="/books" 
                            className="bg-white text-black px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-2xl active:scale-95"
                        >
                            Explorar Biblioteca
                        </Link>
                        <Link 
                            href="/register" 
                            className="text-white border border-gray-800 px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95"
                        >
                            Crear Cuenta
                        </Link>
                    </div>
                </div>

                {/* Decoración de fondo (Sutil) */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                </div>
            </section>

            {/* --- SECCIÓN: CÓMO FUNCIONA (SISTEMA DE 3 PASOS) --- */}
            <section className="py-32 px-8 border-t border-gray-900 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-left mb-20 border-l border-white pl-6">
                        <h2 className="font-serif-logo text-4xl md:text-5xl mb-2">El Concepto</h2>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Tres pasos para tu próximo libro</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="group">
                            <span className="text-4xl font-serif-logo text-gray-800 group-hover:text-white transition-colors duration-500">01</span>
                            <h3 className="text-lg font-bold mt-4 mb-3 uppercase tracking-wider">Publica</h3>
                            <p className="text-gray-500 text-sm leading-relaxed tracking-wide">
                                Sube esos libros que ya leíste y dales una nueva vida. Tu biblioteca personal es tu moneda de cambio.
                            </p>
                        </div>

                        <div className="group">
                            <span className="text-4xl font-serif-logo text-gray-800 group-hover:text-white transition-colors duration-500">02</span>
                            <h3 className="text-lg font-bold mt-4 mb-3 uppercase tracking-wider">Propón</h3>
                            <h3 className="hidden group-hover:block absolute"></h3>
                            <p className="text-gray-500 text-sm leading-relaxed tracking-wide">
                                Encuentra un ejemplar que desees y ofrece uno de los tuyos. Intercambios directos, sin complicaciones.
                            </p>
                        </div>

                        <div className="group">
                            <span className="text-4xl font-serif-logo text-gray-800 group-hover:text-white transition-colors duration-500">03</span>
                            <h3 className="text-lg font-bold mt-4 mb-3 uppercase tracking-wider">Transforma</h3>
                            <p className="text-gray-500 text-sm leading-relaxed tracking-wide">
                                Una vez aceptado, el intercambio se completa. Recibe tu nueva historia y deja que la metamorfosis continúe.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN: CTA FINAL --- */}
            <section className="py-40 px-8 text-center bg-black">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif-logo text-5xl md:text-6xl mb-8">
                        ¿Listo para empezar?
                    </h2>
                    <Link 
                        href="/register" 
                        className="inline-block bg-white text-black px-12 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-all shadow-2xl"
                    >
                        Unirse a la Comunidad
                    </Link>
                </div>
            </section>
        </div>
    );
}