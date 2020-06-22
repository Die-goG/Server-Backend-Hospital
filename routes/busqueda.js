var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ================================================
//  Busqueda por coleccion
// ================================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i'); //expresion regular

    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medico':
            promesa = buscarMedicos(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: true,
                mensaje: 'Los tipos de busqueda solo son:usuario/medico/hospital',
                error: { mensaje: 'Tipo de tabla/coleccion no valido' }
            });
    }


    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data //[tabla]no es solo el titulo sino el nombre de la tabla
        });
    });

});

// ================================================
//  Busqueda general
// ================================================

app.get('/todo/:busqueda', (req, res) => {

    //Extraemos el parametro de busqueda
    // es lo que el usuario escribe en el segmento del URL
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    //(ECMASCRIPT 6)Este codigo nos permite enviar un arreglo de promesas, ejecutarlas
    // y si todas responden correctamente, podemos dispara un then y si una falla 
    // tendramos que ejecutara un catch
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]

            });
        });
});

// ================================================
//  Promesas
// ================================================
// Esta funcion va a regresar una promesa
//Busqueda en 1 columna y que usuarios creao el hospital
function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'usuario email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales); //Devuelve hospitales
                }
            });
    });
}

//Busqueda en 1 columna
function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos); //Devuelve medicos
            }
        });
    });
}

//Busqueda en 2 columnas
function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        //Usuario.find()  //mostramos todos los datos de usuarios
        Usuario.find({}, 'nombre email role') //mostramos solo datos seleccionados
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = app;