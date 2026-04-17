export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 text-center">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} Mi Proyecto Final. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}