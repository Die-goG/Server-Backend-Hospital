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
const putHospital = async(req, res = response) => {

    //Tomamos el id del hospital
    const hospitalId = req.params.id; //id de hospital
    const uid = req.uid; //id de usuario que hizo la ultima modificacion

    try {

        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(400).json({
                ok: true,
                msg: 'Hospital no encontrado por ID'
            });
        }

        //hospital.nombre = req.body.nombre; // es el nombre del hospital que viene en el body

        //Aqui viene todo lo que mandan en el put
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        };

        //Actulizamos los datos en la base 
        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, { new: true }); //con new: true: regresamo el ultimo

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en putHospital'
        });
    }

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
const deleteHospital = async(req, res) => {

    //Tomamos el id del hospital
    const hospitalId = req.params.id; //id de hospital

    try {

        //Buscamos al hospital
        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(400).json({
                ok: true,
                msg: 'Hospital no encontrado por ID'
            });
        }

        //Eliminamos los datos en la base 
        await Hospital.findByIdAndDelete(hospitalId);

        res.json({
            ok: true,
            msg: 'Hospital Eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado en deleteHospital'
        });
    }
};

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { getHospital, postHospital, putHospital, deleteHospital };