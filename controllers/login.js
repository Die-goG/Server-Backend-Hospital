const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


// ================================================
//  POST : Login
// ================================================


// ==============================================================================================================
//  Importante (getMenuFrontEnd): en todas las opcione en donde regresamos un token, tambien regresamos un menu
//              y en donde sea que grabe el token en el localstorage, tambien grabo el menu  
// ==============================================================================================================


const login = async(req, res = response) => {

    //extraemos el email y password del body
    const { email, password } = req.body;


    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido .. '
            });
        }

        // //Verifica password
        const validoPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validoPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            });
        }

        // Generamos un token jwt
        const token = await generarJWT(usuarioDB._id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role) // regresamos el menu segun el role del usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }

};

// ================================================
//  POST : Login Google
// ================================================

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    // console.log('Token recibo = ', googleToken); // token que recivo del frontend

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        //Verificamos si el usuarios que esta registrado en google ya tiene cuenta en el sistema
        const usuarioDB = await Usuario.findOne({ email });

        console.log('usuarioDB = ', usuarioDB);

        let usuario;

        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({

                usuario: name,
                email,
                password: '@@@', //para los usuarios de google no tomamos en cuenta el password
                img: picture,
                google: true

            });
        } else {
            // si existe el usuario
            usuario = usuarioDB;
            usuario.google = true; //marcamos que fue un usuario de google
            //usuario.password = '@@@'; //si no cambiamos el password, la persona tendra los metodo de autenticacion, si cambiamos la
            //password perdera la autenticacion realizada en el sistema
        }

        //Guardamos en la base de datos
        await usuario.save();

        // Generamos un token jwt
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token, //visualizamos el token generado por el backend
            menu: getMenuFrontEnd(usuario.role) // regresamos el menu segun el role del usuario

        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token Google incorrecto'
        });
    }
};


// ================================================
//  GET : Login renew, generamos un nuevo token
// ================================================

const renewToken = async(req, res = response) => {

    //tomamos el uid del usuario que viene en la request
    const uid = req.uid;

    //Generamos el token
    const token = await generarJWT(uid); // el token se genera en base a uid del usuario

    //Obtener el usuario por UID
    const datosUsuario = await Usuario.findById(uid); // el que enviamos en respuesta al frontend en la funcion validaToken

    res.json({
        oK: true,
        token,
        datosUsuario,
        menu: getMenuFrontEnd(datosUsuario.role) // regresamos el menu segun el role del usuario

    });
};



// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { login, googleSignIn, renewToken };