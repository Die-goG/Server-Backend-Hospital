// ================================================
//  Ruta: /usuario
// ================================================

const { check, validationResult } = require('express-validator'); // importamos el modulo para validad los campos
const { Router } = require('express');
const { getUsuario, postUsuario, putUsuario, eliminarUsuario } = require('../controllers/usuario'); // importamos la funcion de controllers/usuario.js
const { validarCampos } = require('../middleware/validar_campos'); // importamos  middleware/validarCampos.js 

const router = Router();

var express = require('express');
var app = express();
var Usuario = require('../models/usuario');

var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/authentication');
const { json } = require('body-parser');
const validar_campos = require('../middleware/validar_campos');
const { route } = require('./app');
const { validarJWT } = require('../middleware/validar_jwt');

// ================================================
//  GET : Listar Usuario
// ================================================

router.get('/', validarJWT, getUsuario);

// ================================================
//  PUT : Actualizar Usuario
// ================================================

router.put('/:id', [
    validarJWT, //verificamos el token
    check('usuario', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
], putUsuario);

// ================================================
//  POST : Crear Usuario
// ================================================

router.post('/',
    // declarmos los middlewares 
    [
        check('usuario', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ], postUsuario
);

// ================================================
//  DELETE : Eliminar Usuario
// ================================================

router.delete('/:id', validarJWT, eliminarUsuario);

//module.exports = app;
module.exports = router;