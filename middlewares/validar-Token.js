import  jwt  from "jsonwebtoken";
import { response, request } from 'express';
import Veterinario from '../models/veterinario.js';

const validarToken = async (req = request, res = response, next) => {
    const { token } = req.params;

    if (!token) {
        //throw new Error('No hay token');
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }
    
    try {
        const { veterinarioID } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el veterinario que corresponde al uid
        const veterinario = await Veterinario.findById( veterinarioID );
        //console.log(veterinario);
        if (!veterinario) {
            return res.status(404).json({
                ok: false,
                msg: 'El veterinario no existe en la base de datos'
            });
        }

        // Validar que el uid no tenga { confirmado: true }
        if (veterinario.confirmado === true) {
            return res.status(401).json({
                ok: false,
                msg: 'El veterinario ya ha sido confirmado'
            });
        } else {
            veterinario.confirmado = true;
            // ELINAR TOKEN
            veterinario.token = null;
        }
        
        await veterinario.save();
        req.veterinario = veterinario;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}


const validarTokenPassword = async (req = request, res = response, next) => {
    const { token } = req.params;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }
    
    try {
        const { veterinarioID } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el veterinario que corresponde al uid
        const veterinario = await Veterinario.findById( veterinarioID );
        console.log({veterinario, token});

        if (!veterinario) {
            return res.status(404).json({
                ok: false,
                msg: 'El veterinario no existe en la base de datos'
            });
        } else {
            res.json({
                ok: true,
                msg: 'Token valido - Usuario Encotrado',
                veterinario
            });
        }

        await veterinario.save();
        req.veterinario = veterinario;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}

export { validarToken, validarTokenPassword };