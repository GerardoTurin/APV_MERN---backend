import express from 'express';
import cors from 'cors';    // Es un middleware que nos permite hacer peticiones a otros servidores ( Protege nuestra API )
import { conectarDB } from '../db/configurarDB.js';
import authRoutes from '../routes/authRoute.js';
import pacienteRoutes from '../routes/pacientesRoutes.js';
import veterinarioRoutes from '../routes/veterinarioRoutes.js';
import corsOptions from '../middlewares/cors-opciones.js';



//! Creamos un servidor con express con clases

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        this.paths = {
            authPath: '/api/auth',          // Creamos una ruta para el login ( autehtication )
            pacientePath: '/api/pacientes', // Creamos una ruta para los pacientes
            veterinarioPath: '/api/veterinario'
        }


        ///Coneccion a la base de datos
        this.conectaBaseDatos();

        // Middlewares
        this.middlewares();
                            
        // Rutas de mi app
        this.routes();
    }
    

    async conectaBaseDatos() {
        await conectarDB();
    }
    
    
    middlewares() {

        // Cors
        this.app.use( cors(corsOptions) ); // use: para usar un middleware
        
        // Lectura y parseo del body
        this.app.use( express.json() );
        this.app.use( express.urlencoded({ extended: true }));
        
        // Directorio carpeta publica
        //this.app.use(express.static('public'));   // use: para usar un middleware

        // File uploads - Carga de archivos
        /* this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        })); */
    }
    
    
    
    // Rutas de mi app
    routes() {
        this.app.use( this.paths.authPath, authRoutes );  // Definimos la ruta para el login ( autehtication )
        this.app.use( this.paths.pacientePath, pacienteRoutes );  // Definimos la ruta para los pacientes
        this.app.use( this.paths.veterinarioPath, veterinarioRoutes );
    }
    
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}



export default Server;