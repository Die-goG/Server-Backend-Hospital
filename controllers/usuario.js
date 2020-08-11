const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

// Importamos el modelo del usuario
const Usuario = require('../models/usuario');
const { Result } = require('express-validator');
const usuario = require('../models/usuario');
// const { LoginTicket } = require('google-auth-library');

// ================================================
//  GET : Listar Usario
// ================================================
const getUsuario = async(req, res) => {

    // const usuario = await Usuario.find({}, 'usuario email role google'); //visualizamos campos especificos
    const usuario = await Usuario.find(); // visualizamos todos los campos

    res.json({
        ok: true,
        usuario,
        uid: req.uid // tomamos el uid del usuario que hizo la peticion, este uid fue envido desde validar_jwt.js (linea:22)
    });
};

// ================================================
//  PUT : Actualizar Usuario
// ================================================

const putUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese uid'
            });
        }

        const { password, google, email, ...campos } = req.body;

        //if (usuarioDB.email !== email) {
        if (usuarioDB.email === email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        // Actualizacion la base con los datos que viene en req (request)

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuarioActualizado,
            'email: ': usuarioDB.email
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en putUsuario'
        });
    }

};

// ================================================
//  POST : Crear Usuario
// ================================================
const postUsuario = async(req, res) => {

    //console.log(req.body); // visualizamos en consolas los datos enviados por el request
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado en el sistema'
            });
        }
        const usuario = new Usuario(req.body);

        //Encriptamos la contraseña con un hash de una sola via
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // grabamos los datos de los usuarios en la base de datos
        await usuario.save();

        // Generamos un token jwt
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en postUsuario'
        });
    }
};

// ================================================
//  DELETE : Eliminar Usuario
// ================================================

const eliminarUsuario = async(req, res) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese uid'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'El usuario fue eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en eliminarUsuario'
        });
    }
};

//exportamos la funcion
module.exports = { getUsuario, postUsuario, putUsuario, eliminarUsuario };