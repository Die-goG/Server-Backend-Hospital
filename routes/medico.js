// ================================================
//  Ruta: /medico
// ================================================
const { Router } = require('express');
const { check } = require('express-validator'); // importamos el modulo para validad los campos
const { validarCampos } = require('../middleware/validar_campos'); // importamos  middleware/validarCampos.js 
const { validarJWT } = require('../middleware/validar_jwt');
const { getMedico, putMedico, postMedico, deleteMedico, getMedicoPorId } = require('../controllers/medico');
const router = Router();


// ================================================
//  GET : Listar medicos
// ================================================

router.get('/', validarJWT, getMedico);

// ================================================
//  PUT : Actualizar medicos
// ================================================

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario ..').not().isEmpty(),
    check('hospital', 'El hospital ingresado debe ser valido').isMongoId(), //Verificamos si el hospital es valido
    validarCampos
], putMedico);

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

router.delete('/:id', validarJWT, deleteMedico);

// ================================================
//  GET : Listar Medico por Id
// ================================================

router.get('/:id', validarJWT, getMedicoPorId);

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;