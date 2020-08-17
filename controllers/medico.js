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
const putMedico = async(req, res = response) => {

    const medicoId = req.params.id;
    const uid = req.uid;

    try {

        //Busco mdico
        const medico = await Medico.findById(medicoId);

        //Busco hospital
        //const hospital =

        if (!medico) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por ID'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medicoActualizado
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Error inesperado en putMedico'
        });

    }

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
const deleteMedico = async(req, res = response) => {

    const medicoId = req.params.id;

    try {

        const medico = await Medico.findById(medicoId);

        if (!medico) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por ID'
            });
        }

        await Medico.findByIdAndDelete(medicoId);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch (error) {

        res.status(500).json({
            ok: true,
            msg: 'Error inesperado deleteMedico'
        });

    }

};

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { getMedico, postMedico, putMedico, deleteMedico };