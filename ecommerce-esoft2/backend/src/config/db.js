//Este arquivo conecta o Node ao MongoDB

import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try{
        const mongoUri = process.env.MONGO_URI;
        
        if(!mongoUri){
            //Verifica se a variável MONGO_URI existe
            throw new Error("Variável MONGO_URI não definida no .env! Crie e configure o arquivo.");
        }

        const conn = await mongoose.connect(mongoUri);
        
        console.log(`(V) MongoDB Conectado: ${conn.connection.host}`);

    }catch(error){
        console.error(`(X) Erro na Conexão com MongoDB: ${error.message}`);
        
        //Encerra o processo se a conexão falhar
        process.exit(1); 
    }
};

export default connectDB;