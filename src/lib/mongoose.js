import mongoose from 'mongoose'; //Importamos el mongoose 
import dns from 'node:dns/promises';

// Configuración de DNS
dns.setServers(['1.1.1.1', '8.8.8.8']);
//En el caso de que este la base de datos o que se genere en el local de Mongoose,es decir el /localhost:27017
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mydatabase';

//Implementación del cache para la conexión del Mongoose

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    //Si ya hay una conexión activa, la reutilizamos inmediatamente
    if (cached.conn) return cached.conn;
    //Si no hay una promesa de conexión en curso, creamos una nueva
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            bufferCommands: false // Desactiva el almacenamiento de comandos en búfer si la conexión cae
        }).then((mongooseInstance) => {
            console.log("Conectado a MongoDB W//W");
            return mongooseInstance;
        });
    }
    //Esperamos a que la promesa se resuelva y guardamos la conexión en caché
    try {
        cached.conn = await cached.promise;
    } catch (e) { //Manejo de errores 
        cached.promise = null;
        throw e;
    }
    
    return cached.conn;
}