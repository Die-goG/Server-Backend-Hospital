const { response } = require('express');
const Medico = require('../models/medico');

// ================================================
//  GET : Listar Medico
// ================================================
const getMedico = async(req, res = response) => {

    // Visualizamos los datos del medico, usuario que lo creo y nombre del hospital al que fue asignado
    const medicos = await Medico.find().populate('usuario').populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    });

};

// ================================================
//  PUT : Actualizar Medico
// ================================================
const putMedico = (req, res) => {

    res.json({
        ok: true,
        msg: 'putMedico'
    });

};

// ================================================
//  POST : Crear Medico
// ================================================
const postMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    // const medico = new Medico(req.body);
    // const uid = req.uid;

    console.log(uid);

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado postMedico'
        });
    }

};

// ================================================
//  DELETE : Eliminar Medico
// ================================================
const deleteMedico = (req, res) => {

    res.json({
        ok: true,
        msg: 'deleteMedico'
    });

};

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { getMedico, postMedico, putMedico, deleteMedico };