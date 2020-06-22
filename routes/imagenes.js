var express = require('express');
var app = express();

//usamos para el path de la imagen
const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res) => {


    //leemos las variables que vienen por la url
    var tipo = req.params.tipo;
    var img = req.params.img;

    //direccion completa para encotrar la imagen
    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    //verificamos si el path es valido
    //devuelve true: la ruta es correcta
    //        false: la ruta es incorrecta
    if (fs.existsSync(path)) {
        res.sendfile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assents/no-image.jpg');
        res.sendFile(pathNoImagen);
    }


    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamenete'
    });

});

module.exports = app;