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

module.exports = router;















// var express = require('express');
// var app = express();
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
// var Usuario = require('../models/usuario');
// //Google
// var CLIENT_ID = require('../config/config').CLIENT_ID;
// const { OAuth2Client } = require('google-auth-library');
// const usuario = require('../models/usuario');
// const client = new OAuth2Client(CLIENT_ID);



// // ================================================
// //  POST : Autenticacion de google
// //  codigo de https://developers.google.com/identity/sign-in/web/backend-auth
// // ================================================
// async function verify(token) {
//     //await = esperar
//     //El await significa que la funcion retorna una promesa y lo que sea que retorne lo va a guardar en ticket
//     const ticket = await client.verifyIdToken({
//         idToken: token, //es el token que generamos con lightserver
//         audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
//         // Or, if multiple clients access the backend:
//         //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//     });
//     const payload = ticket.getPayload(); //en payload tenemos toda la info del usuario
//     // const userid = payload['sub'];
//     // If request specified a G Suite domain:
//     // const domain = payload['hd'];

//     return {
//         nombre: payload.name,
//         email: payload.email,
//         img: payload.picture,
//         google: true,
//         payload: payload
//     };
// }

// app.post('/google', async(req, res) => {

//     //obtenemos el valor del token que viene por la url y los guardamos en la variable token
//     var token = req.body.token;

//     //en googleUser va a estar toda la informacion que retorna la funcion verify
//     var googleUser = await verify(token)
//         .catch(e => {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Token no valido'
//             });
//         });

//     //vamos agrabar al usuarion en la base de datos
//     Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar usuario',
//                 errors: err
//             });
//         }
//         //verificamos si el usuario existe: si existe verificamos si esta logeado por google
//         if (usuarioDB) {
//             //verificamos el campo google para saer como fue autenticado el usuarios
//             if (usuarioDB.google === false) { //usuarios fue autenticado por el sistema    
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Debe usar otra autenticacion, la que ingreso ya esta registrada',
//                     errors: err
//                 });

//             } else { //usuarios autenticado por google por lo que debemos crear un token
//                 var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
//                 res.status(200).json({
//                     ok: true,
//                     Usuario: usuarioDB,
//                     token: token,
//                     id: usuarioDB._id
//                 });
//             }

//             //caso contrario el usuario no existe ... hay que crearlo
//         } else {
//             var usuario = new Usuario();
//             usuario.nombre = googleUser.nombre;
//             usuario.email = googleUser.email;
//             usuario.img = googleUser.img;
//             usuario.google = true;
//             usuario.password = ':)';

//             //grabamos a usuario
//             usuario.save((err, usuarioDB) => {

//                 var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

//                 res.status(200).json({
//                     ok: true,
//                     Usuario: usuarioDB,
//                     token: token,
//                     id: usuarioDB._id
//                 });

//             });
//         }

//     });

//     // return res.status(200).json({
//     //     ok: true,
//     //     mensaje: 'Ok .. ',
//     //     googleUser: googleUser
//     // });

// });


// // ================================================
// //  POST : Autenticacion normal
// // ================================================

// app.post('/', (req, res) => {

//     var body = req.body;

//     Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar usuario',
//                 errors: err
//             });
//         }

//         if (!usuarioDB) {

//             return res.status(400).json({
//                 ok: false,
//                 mansaje: 'Credenciales incorrectas - email',
//                 errors: err
//             });
//         }

//         if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Credenciales incorrectas - password',
//                 errors: err
//             });
//         }

//         usuarioDB.password = ':)';

//         // **************
//         // Creamos Token
//         // **************

//         var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

//         res.status(200).json({
//             ok: true,
//             Usuario: usuarioDB,
//             token: token,
//             id: usuarioDB._id
//         });
//     });


// });

// module.exports = app;