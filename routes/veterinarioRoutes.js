import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { emailValido, nuevoPassword, olvidePassword, actualizarNuevoPassword } from '../helpers/db-validators.js';
import { getVeteConfirmado, getVeterinario, getVeterinarioss, postVeterinario, actualizarPerfil } from '../controllers/veterinarioControllers.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarToken, validarTokenPassword } from '../middlewares/validar-Token.js';
import { checkAuth } from '../middlewares/checkAuth.js';




const router = Router();

//! Variables de validación
const validacionNombre = [ body('nombre', 'El nombre es necesario').not().isEmpty() ];
const validacionEmail = [ body('email', 'El correo no es valido').custom( emailValido ).isEmail() ];



//! Rutas para veterinarios
//* Area Publica

// Crear Veterinario
router.post('/', 
                validacionNombre,
                validacionEmail,
                validarCampos,
                postVeterinario );


// Traer todos los veterinarios
router.get('/', getVeterinarioss );


// Confirmar veterinario
router.get('/confirmar/:token',
                        validarToken,
                        validarCampos,
                        getVeteConfirmado );


// Olvidar contraseña
router.post('/olvide', olvidePassword );
router.route('/olvide/:token').get( validarTokenPassword )
router.route('/olvide/:token').post( nuevoPassword );





//* Area Privada
router.get('/perfil', 
                    checkAuth,
                    validarCampos,
                    getVeterinario );

router.put('/perfil/:id', checkAuth, actualizarPerfil );

router.put('/actualizar-password', checkAuth, actualizarNuevoPassword );


router.delete('/:id', (req, res) => {
    res.json({
        ok: true,
        msg: 'delete veterinarios'
    });
});




export default router;