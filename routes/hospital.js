var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/authentication');


// ================================================
//  GET : Listar hospitales
// ================================================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, 'nombre usuario img')
        .skip(desde)
        .limit(14)
        .populate('usuario', 'usuario email img') //mostramos usuario que lo creo
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error la cargar hospitales',
                    errors: err
                });
            }

            Hospital.countDocuments({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    hospital: hospital,
                    total: conteo

                });
            });


        });

});

// ================================================
//  PUT : Actualizar hospital
// ================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital con el id ' + id + 'no existe',
                errors: { mensaje: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        //hospital.img = body.img;
        //hospital.usuario = body.usuario;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: hospitalGuardado
            });

        });

    });

});


// ================================================
//  POST : Crea un nuevo hospital
// ================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: body,
            hospital1: hospitalGuardado,
            usuariotoken: req.usuario
        });

    });

});

// ================================================
//  DELETE : Elimina hospital
// ================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: err
            });
        }
        res.status(200).json({ //erro 201= recurso creado
            ok: true,
            hospital: id //nombre de la propiedad que quiero retornar
        });

    });

});


module.exports = app;