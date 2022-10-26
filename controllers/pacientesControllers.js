import { response, request } from 'express';
// import bcryptjs from 'bcryptjs'; // Encriptar contraseñas
import Paciente from '../models/paciente.js';



// Agregar/Crear Paciente
const postPaciente = async ( req = request, res = response ) => {
    const { nombre, propietario, email, fecha, sintomas } = req.body;

    // Nuevo paciente
    const paciente = new Paciente({ nombre, propietario, email, fecha, sintomas });
    paciente.veterinario = req.veterinario._id.toString();

    try {
        // Grabar en la base de datos
        await paciente.save();

        res.json(
            paciente
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
        
}



// Obtener Pacientes - GET
const getPacientess = async ( req = request, res = response ) => {
    // Traemos todos los pacientes
    const pacientes = await Paciente.find().where('veterinario')
                                            .equals(req.veterinario._id.toString());

    res.json(
            pacientes
    );
};


// Obtener Paciente - GET - ID
const getPaciente = async ( req = request, res = response ) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findById(id).where('veterinario')
                                                    .equals(req.veterinario._id.toString());
        if (!paciente) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        }

        res.json({
            ok: true,
            msg: 'Paciente',
            paciente
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};





// Actualizar Paciente - PUT
const putPaciente = async ( req = request, res = response ) => {
    const { id } = req.params;
    const { _id, ...campos } = req.body;    // Actualizamos los campos menos el id

    try {
        const paciente = await Paciente.findById(id).where('veterinario')
                                                    .equals(req.veterinario._id.toString());
        if (!paciente) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        }

        // Actualizamos los datos
        const pacienteActualizado = await Paciente.findByIdAndUpdate(id, campos, { new: true });

        res.json(
            pacienteActualizado
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};




// Eliminar Paciente - DELETE
const deletePaciente = async ( req = request, res = response ) => {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findById(id).where('veterinario')
                                                    .equals(req.veterinario._id.toString());
        if (!paciente) {
            return res.status(404).json({
                ok: false,
                msg: 'Paciente no encontrado'
            });
        }

        // Eliminamos el paciente
        await Paciente.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Paciente Eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};





export {
    postPaciente,
    getPacientess,
    getPaciente,
    putPaciente,
    deletePaciente
};