// ================================================
//  Ruta: /login
// ================================================

const { Router } = require('express');
const { login } = require('../controllers/login');
const { validarCampos } = require('../middleware/validar_campos'); // importamos  middleware/validarCampos.js 
const { check } = require('express-validator');
const router = Router();

router.post('/', [

    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,

], login);


// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;