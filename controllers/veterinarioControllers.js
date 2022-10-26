import { response, request } from 'express';
//import bcryptjs from 'bcryptjs'; // Encriptar contraseñas
import { generarToken } from '../helpers/generaToken.js';
import Veterinario from '../models/veterinario.js';
import emailRegistro from '../helpers/emailRegistro.js';




// Registrar/Crear Veterinario
const postVeterinario = async (req = request, res = response) => {
        const { nombre, password, email } = req.body;

        // Nuevo veterinario
        const veterinario = new Veterinario({ nombre, password, email });

        // Generamos el token
        const token = await generarToken(veterinario._id);

        //Grabar en la base de datos
        await veterinario.save();

        // Enviar email
        emailRegistro({ email, nombre, token });

        res.json({
                ok: true,
                msg: 'Veterinario Registrado',
                veterinario,
                token
        });
};




// Traer todos los veterinarios
const getVeterinarioss = async (req = request, res = response) => {
        // Traemos todos los veterinarios
        const veterinarios = await Veterinario.find();

        res.json({
                ok: true,
                msg: 'Veterinarios',
                veterinarios
        });
};

// Traer perfil de un veterinario
const getVeterinario = async (req = request, res = response) => {
        // Traer data perfil del veterinario
        const { veterinario } = req;


        res.json({
                ok: true,
                veterinario
        });
};

// Confirmar veterinario
const getVeteConfirmado = async (req = request, res = response) => {
        res.json({
                ok: true,
                msg: 'Acceso Confirmado',
                veterinario: req.veterinario
        });
};


//PUT - Actualizar perfil
const actualizarPerfil = async (req = request, res = response) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error('No se encontro el veterinario');
        return res.status(404).json({
            ok: false,
            msg: error.message
        });
    }

    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error('El email ya esta registrado');
            return res.status(400).json({
                ok: false,
                msg: error.message
            });
        }
    }


    try {
        // Actualizar veterinario
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        // Grabar veterinario
        const veterinarioActualizado = await veterinario.save();

        res.json( veterinarioActualizado );
    } catch (error) {
        console.log(error);
    }
};





export {
        getVeterinarioss,
        getVeterinario,
        getVeteConfirmado,
        postVeterinario,
        actualizarPerfil
}