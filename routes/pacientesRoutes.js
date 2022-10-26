import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { deletePaciente, getPaciente, getPacientess, postPaciente, putPaciente } from '../controllers/pacientesControllers.js';
import { checkAuth } from '../middlewares/checkAuth.js';




const router = Router();




// GET
router.get('/', 
                checkAuth,
                getPacientess );






// GET - ID
router.get('/:id', 
                    checkAuth,
                    getPaciente );






// POST
router.post('/', 
                checkAuth,
                postPaciente );

// PUT
router.put('/:id', 
                    checkAuth,
                    putPaciente );

// DELETE
router.delete('/:id', 
                        checkAuth,
                        deletePaciente );











export default router;