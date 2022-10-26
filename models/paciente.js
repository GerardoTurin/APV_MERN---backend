import mongoose from "mongoose";
const { Schema, model } = mongoose;


const pacientesSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        trim: true
    },
    propietario: {
        type: String,
        required: [true, 'El propietario es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        trim: true
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es necesaria'],
        default: Date.now()
    },
    sintomas: {
        type: String,
        required: [true, 'Los sintomas son necesarios'],
        trim: true
    },
    veterinario: {
        type: Schema.Types.ObjectId,
        ref: 'Veterinario',
    },
    }, {
        timestamps: true
    }
);


export default model('Paciente', pacientesSchema);