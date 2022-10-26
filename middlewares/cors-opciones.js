//import cors from 'cors';


const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

export default corsOptions;

