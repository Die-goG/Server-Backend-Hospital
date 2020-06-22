var express = require('express');
var app = express();
var Medico = require('../models/medico');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/authentication');



// ================================================
//  GET : Listar medico
// ================================================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(3)
        .populate('usuario', 'usuario emial') //mostramos el usario que creo el medico
        .populate('hospital') //mostramos el hospital a que pertenece
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar medico',
                    errors: err
                });
            }

            Medico.countDocuments({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    medico: medico,
                    total: conteo
                });

            });

        });

});


// ================================================
//  PUT : Actualizar medico
// ================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico con el id ' + id + 'no existe',
                errors: { mensaje: 'No existe medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});



// ================================================
//  POST : Crea un nuevo medico
// ================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(500), json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medico
        });

    });

});

// ================================================
//  DELETE : Elimina medico
// ================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500), json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            medico: id
        });
    });

});

module.exports = app;