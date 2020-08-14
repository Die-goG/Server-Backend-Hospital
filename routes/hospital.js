// ================================================
//  Ruta: /hospial
// ================================================
const { Router } = require('express');
const { check } = require('express-validator'); // importamos el modulo para validad los campos
const { validarCampos } = require('../middleware/validar_campos'); // importamos  middleware/validarCampos.js 
const { getHospital, putHospital, postHospital, deleteHospital } = require('../controllers/hospital');
const { validarJWT } = require('../middleware/validar_jwt');
const router = Router();


// ================================================
//  GET : Listar hospitales
// ================================================

router.get('/', [], getHospital);

// ================================================
//  PUT : Actualizar hospital
// ================================================

router.put('/:id', [], putHospital);

// ================================================
//  POST : Crear Usuario
// ================================================

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario ..').not().isEmpty(),
    validarCampos
], postHospital);

// ================================================
//  DELETE : Elimina hospital
// ================================================

router.delete('/:id', [], deleteHospital);

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;