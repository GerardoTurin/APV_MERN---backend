
import Veterinario from "../models/veterinario.js";
import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import bcryptjs from 'bcryptjs'; // Encriptar contraseñas
import { generarToken } from "./generaToken.js";
import emailOlvidePassword from "./emailOlvidePassword.js";



const emailValido = async ( email = '' ) => {
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
        throw new Error(` El email ${email} ya está registrado`);
    }
}


const idValidoPorUuario = async ( id ) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`El id ${id} no es valido de mongoose`);
    }
    
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(` El usuario con id ${id} no existe en la base de datos`);
    }

    /*

    OTRA FORMA DE VALIDAR EL ID

    const existeUsuarioPorId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await Usuario.findById( id ).exec();
        if ( !existeUsuario ) {
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
    };
    -----------------

    router.put('/:id', [
    check('id').custom( existeUsuarioPorId ), // Aquí se realizan las dos validaciones
    validarCampos
    ], usuariosPut);
    

     */
}



// Olvide Contraseña
const olvidePassword = async (req = request, res = response) => {
    const { email } = req.body;

    // Verificar si el email existe
    const veterinario = await Veterinario.findOne({ email });
    if (!veterinario) {
        return res.status(400).json({
            ok: false,
            msg: 'El Usuario no Existe'
        });
    }

    try {
        // Generar token
        const token = await generarToken(veterinario._id);
        await veterinario.save();

        // Enviar email con las instrucciones
        await emailOlvidePassword({
            email,
            nombre: veterinario.nombre,
            token
        });
    
        res.json({
            ok: true,
            msg: 'Hemos enviado un email para que sigas las instrucciones',
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};



const nuevoPassword = async (req = request, res = response, next) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }

    const { veterinarioID } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el veterinario que corresponde al uid
    const veterinario = await Veterinario.findById( veterinarioID );
    console.log(veterinario);
    if (!veterinario) {
        return res.status(404).json({
            ok: false,
            msg: 'El veterinario no existe en la base de datos'
        });
    }

    
    try {
        //req.veterinario = veterinario;  // Guardo el veterinario en el request
        //req.token = token;  // Guardo el token en el request
        
        // Actualizar Password
        veterinario.password = password;
        
        // Guardar en la base de datos
        await veterinario.save(); 

        res.json({
            ok: true,
            msg: 'Password Actualizado Correctamente',
        });
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};



const actualizarNuevoPassword = async (req = request, res = response) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // Verificar si el veterinario existe
    const veterinario = await Veterinario.findById( id );

    if (!veterinario) {
        const error = new Error('No se encontro el veterinario');
        return res.status(404).json({
            ok: false,
            msg: error.message
        });
    }

    // Verificar si el password actual es correcto
    const passwordCorrecto = bcryptjs.compareSync(pwd_actual, veterinario.password);
    if (!passwordCorrecto) {
        return res.status(400).json({
            ok: false,
            msg: 'El password actual no es correcto'
        });
    }

    // Almacenar el nuevo password
    veterinario.password = pwd_nuevo;

    // Guardar en la base de datos
    await veterinario.save();

    res.json({
        ok: true,
        msg: 'Password Actualizado Correctamente',
    });
}








export {
    emailValido,
    idValidoPorUuario,
    olvidePassword,
    nuevoPassword,
    actualizarNuevoPassword
}