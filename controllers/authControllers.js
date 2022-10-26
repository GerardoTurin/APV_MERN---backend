import { response, request } from 'express';
import Veterinario from '../models/veterinario.js';
import bcryptjs from 'bcryptjs'; // Encriptar contraseñas
import { generarToken } from '../helpers/generaToken.js';







// Creamos y exportamos un controlador para el login ( autehtication )

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        // Verificamos si el email existe en la base de datos
        const veterinario = await Veterinario.findOne({ email });

        if( !veterinario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Contraseña Incorrectos - EMAIL'
            })
        }

        // Verificamos si el usuario esta activo
        if( !veterinario.confirmado ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Contraseña Incorrectos - CONFIRMADO : FALSE'
            });
        }

        // Verificamos si la contraseña es correcta
        const validPassword = bcryptjs.compareSync( password, veterinario.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña Incorrecta'
            });
        }

        // Generamos el token
        //const token = await generarToken( veterinario._id );

        return res.json({
            veterinario,
            token: await generarToken( veterinario._id )
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, por favor intente de nuevo'
        });
    }
};



export { 
    login
};