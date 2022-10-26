import  jwt  from "jsonwebtoken";


const generarToken = (veterinarioID = '') => {
    return new Promise((resolve, reject) => {
        const payload = { veterinarioID };  // Este es el payload que se va a encriptar  ( buscamos el id del veterinario )

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '1d' }, (error, token) => {
            if (error) {
                console.log(error);
                reject('Error al crear el token');
            } else {
                resolve(token);
            }
        }
    )});
}


export {
    generarToken
};