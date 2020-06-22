var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');

// ================================================
//  GET : Listar usario
// ================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //si no viene algo, coloca el 0
    desde = Number(desde); //todo lo que venga tiene que ser 0

    Usuario.find({}, 'usuario email img role password')
        .skip(desde)
        .limit(5) //limitamos el numero de registros registrados
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                //Hacemos el conteo de documentos
                Usuario.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });


            });

});

// ================================================
//  POST : Crear Usuario
// ================================================

app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        usuario: body.usuario,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario //vemos que usuario realizo la creacion del usuario
        });
    });

});

module.exports = app;