// ================================================
//  Ruta: /login
// ================================================

const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/login');
const { validarCampos } = require('../middleware/validar_campos'); // importamos  middleware/validarCampos.js 
const { check } = require('express-validator');
const router = Router();

// ================================================
//  POST : Login
// ================================================

router.post('/', [

    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,

], login);

// ================================================
//  POST : Login Google
// ================================================

router.post('/google', [

    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos,

], googleSignIn);

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;