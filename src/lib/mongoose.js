import mongoose from 'mongoose';
import dns from 'node:dns/promises';

// Configuración de DNS
dns.setServers(['1.1.1.1', '8.8.8.8']);

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/mydatabase';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            bufferCommands: false
        }).then((mongooseInstance) => {
            console.log("✅ Conectado a MongoDB");
            return mongooseInstance;
        });
    }
    
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    
    return cached.conn;
}