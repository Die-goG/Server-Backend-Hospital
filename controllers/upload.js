const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const path = require('path');
const fs = require('fs');

// ================================================
//  PUT : Subir archivos
// ================================================
const subirArhivos = (req, res = response) => {

    // Tomamos el valor que nos viene en la solicitud
    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValido = ['hospitales', 'medicos', 'usuarios'];

    //Verificamos el tipo (hospital,usuario,medico)
    if (!tiposValido.includes(tipo)) {

        return res.status(400).json({
            ok: true,
            msg: 'El tipo debe ser hospitales,usuarios,medicos'
        });

    }

    //Verificamos si hay imagen enviada
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    //Procesar la imagen
    //Extraemos la imagen
    const file = req.files.imagen;

    //Obtenemos la extension del archivo
    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones validas
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'git'];

    //Verificamos la extension
    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });
    }

    //Generamos el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extension }`;

    //Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    //Movemos la imagen
    file.mv(path, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar la base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
};

// ================================================
//  GET : Ver archivos
// ================================================

const verArchivos = (req, res = response) => {

    // Tomamos el valor que nos viene en la solicitud
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    // PAth de la imagen
    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    // Cargamos imagen
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/noimagen.png`);
        res.sendFile(pathImg);
    }

};


// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { subirArhivos, verArchivos };