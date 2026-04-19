/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  // Añadimos configuración para el tamaño de la API
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Permite hasta 10MB (suficiente para fotos Base64)
    },
  },
  // Si usas Server Actions (muy probable en Next.js 15), añade esto también:
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;