const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

// ================================================
//  GET : Busqueda
// ================================================

const getBusqueda = async(req, res = response) => {

    // Tomamos el valor que nos viene en la solicitud
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    //La busqueda sera realizada por nombre y usuario
    // const usuario = await Usuario.find({ usuario: regex });
    // const hospital = await Hospital.find({ nombre: regex });
    // const medico = await Hospital.find({ nombre: regex });

    // o

    const [usuario, medico, hospital] = await Promise.all([
        await Usuario.find({ usuario: regex }),
        await Medico.find({ nombre: regex }),
        await Hospital.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuario,
        hospital,
        medico
    });

};

// ================================================
//  GET : Busqueda por coleccion
// ================================================

const getColeccion = async(req, res = response) => {

    // Tomamos el valor que nos viene en la solicitud
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;

    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {

        case 'medico':
            data = await Medico.find({ nombre: regex }).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
            break;
        case 'hospital':
            data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img');
            //data = await Hospital.find({ nombre: regex }).populate('usuario', 'usuario img _id');
            break;
        case 'usuario':
            data = await Usuario.find({ usuario: regex });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La coleccion enviada debe ser : medico, hospital o usuario'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });

};

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { getBusqueda, getColeccion };