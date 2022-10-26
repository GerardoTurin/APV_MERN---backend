import Veterinario from '../models/veterinario.js';
import  jwt  from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);  // Es para decodificar el token
        const veterinario = await Veterinario.findById(decoded.veterinarioID);  // Buscamos el veterinario por el id

        if (!veterinario) {
            return res.status(404).json({
                ok: false,
                msg: 'El veterinario no existe en la base de datos'
            });
        }

        req.veterinario = veterinario;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
};



export { checkAuth };