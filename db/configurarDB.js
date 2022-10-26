import mongoose from "mongoose";
import colors from 'colors';    // Importar módulo colors


const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Base de datos ONLINE - Proyecto MERN'.green);
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar con la base de datos'.red);
    }
};



export {
    conectarDB
}