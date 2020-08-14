// ================================================
//  Ruta: /medico
// ================================================
const { Router } = require('express');
const { check } = require('express-validator'); // importamos el modulo para validad los campos
const { validarCampos } = require('../middleware/validar_campos'); // importamos  middleware/validarCampos.js 
const { validarJWT } = require('../middleware/validar_jwt');
const { getMedico, putMedico, postMedico, deleteMedico } = require('../controllers/medico');
const router = Router();


// ================================================
//  GET : Listar medicos
// ================================================

router.get('/', [], getMedico);

// ================================================
//  PUT : Actualizar medicos
// ================================================

router.put('/:id', [], putMedico);

// ================================================
//  POST : Crear medicos
// ================================================

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario ..').not().isEmpty(),
    check('hospital', 'El hospital ingresado debe ser valido').isMongoId(), //verificamos que el id del hospital enviado exista en el sistema y sea valido
    validarCampos,
], postMedico);

// ================================================
//  DELETE : Elimina medicos
// ================================================

router.delete('/:id', [], deleteMedico);

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;