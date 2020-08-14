const { response } = require('express');
const Hospital = require('../models/hospital');

// ================================================
//  GET : Listar Hospital
// ================================================
const getHospital = async(req, res = response) => {

    // Muesta todos los datos del usuario que creo el hospital
    // const hospitales = await Hospital.find().populate('usuario');
    // Muesta nombre e img del usuario que creo el hospital
    const hospitales = await Hospital.find().populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });

};


// ================================================
//  PUT : Actualizar Hospital
// ================================================
const putHospital = (req, res) => {

    res.json({
        ok: true,
        msg: 'putHospital'
    });

};

// ================================================
//  POST : Crear Hospital
// ================================================
const postHospital = async(req, res = response) => {

    // tomamos el uid del usuario autenticado
    // Forma desestructurada
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    //Forma NO desestructurada
    // const hospital = new Hospital(req.body);
    // const uid = req.uid; 
    //console.log(uid); //mostramos el uid en la consola luego de pasar su validadacion por el token

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en postHospital'
        });

    }

};


// ================================================
//  DELETE : Eliminar Hospital
// ================================================
const deleteHospital = (req, res) => {

    res.json({
        ok: true,
        msg: 'deleteHospital'
    });

};

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { getHospital, postHospital, putHospital, deleteHospital };