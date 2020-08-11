const { response } = require('express');
const Usuario = require('../models/usuario');
const { json } = require('body-parser');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

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

module.exports = { login };