

import bcryptjs from 'bcryptjs'; // Encriptar contraseñas
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const veterinarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es Obligatoria']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    confirmado: {
        type: Boolean,
        default: false
    },


});


// Encriptar contraseña
veterinarioSchema.pre('save', async function(next) {

    // Si el password no ha sido modificado, no lo encriptamos
    if (!this.isModified('password')) { 
        return next();
    }

    const salt = await bcryptjs.genSalt(10);  // Este es el numero de vueltas que se le da a la encriptacion
    this.password = await bcryptjs.hash(this.password, salt);   // Encriptamos la contraseña

});


//! Para que no se muestre el password en la respuesta

veterinarioSchema.method('toJSON', function() {
    const { __v, password, ...veterinario } = this.toObject(); 
    //veterinario.uID = _id;  // Cambiamos el nombre del id por uID
    return veterinario;
});


export default model('Veterinario', veterinarioSchema);