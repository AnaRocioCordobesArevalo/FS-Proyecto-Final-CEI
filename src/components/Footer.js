export default function Footer() {
    return (
        <footer className="bg-black text-white border-t border-gray-900 mt-auto pt-16 pb-8 px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                
                

                

                {/* Línea divisoria sutil */}
                <div className="w-full h-[1px] bg-gray-900 mb-8"></div>

                {/* Copyright y marca */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.1em] text-gray-600 font-medium">
                    <p>
                        © {new Date().getFullYear()} Metamorfosis. Built for the community.
                    </p>
                    <p className="flex items-center gap-2">
                        Hecho por Ana Rocio Cordobes Arevalo
                    </p>
                </div>
            </div>
        </footer>
    );
}