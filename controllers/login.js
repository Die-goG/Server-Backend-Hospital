const { response } = require('express');
const Usuario = require('../models/usuario');
const { json } = require('body-parser');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');

// ================================================
//  POST : Login
// ================================================

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
            token
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

    console.log(googleToken);

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        //Verificamos si el usuarios que esta registrado en google ya tiene cuenta en el sistema
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({

                nombre: name,
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
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            token //visualizamos el token generado por el backend
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

    res.json({
        oK: true,
        token
    });
};



// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { login, googleSignIn, renewToken };