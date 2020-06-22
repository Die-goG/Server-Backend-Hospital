//Para subir archivo vamos a utlizar lalibreria express-fileupload
//Richard Girges

var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
var fs = require('fs'); //nos ayudara a obtener el archivo existente

//Declaramos un middlerare
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    //Obtenemos los parametros que recibimo por el url y los asignamos a las variables
    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de colleccion
    var tiposValidos = ['medicos', 'hospitales', 'usuarios'];

    //Verficamos que direccionesmos a tipo corresto
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Coleccion no es valida',
            errors: { message: 'Coleccion no es valida' }
        });
    }


    if (!req.files) { //preguntamos si tenemos algun archivo en el req

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono archivo',
            errors: { message: 'Debe seleccionar un archivo' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    //Extraemos la extension del archivo y los cortamos por el punto
    //nombreCortado sera igual a un arreglo con todas las palabras del nombre del archivo
    var nombreCortado = archivo.name.split('.');
    //Obtenemos la extencion de la imagen, que es la ultima posicion del arreglo nombreCortado
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Arreglo de extensiones permitidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //con la funcion indexOf,si no encuentra la extencion en el arreglo nos devuelve -1
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son :' + extensionesValidas.join(', ') }
        });
    }

    //Asignamos un nombre al archivo 
    //13123451314-123.png
    //Tomamos los milisegundo como numero randomico para el nombre del archivo

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     tipo: tipo,
        //     id: id,
        //     nombreArchivo: nombreArchivo,
        //     nombreCortado: nombreCortado
        // });
    });
});

//Funcion para actulizar
//se usa res, xq vamos a sacar la respuesta en formato json
function subirPorTipo(tipo, id, nombreArchivo, res) {
    //validamos la imagen del usuario
    if (tipo === 'usuarios') {

        //este callback tiene como respuesta un err o un usuario si lo encuentra
        Usuario.findById(id, (err, usuario) => {

            //si no encuentra a usuario
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });

            } else {

                var pathViejo = '../uploads/usuarios/' + usuario.img;
                // //Si existe, elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                //almacenamos el unicamente el nombre del archivo en propiedad de la base de datos
                usuario.img = nombreArchivo;

                //este usuario viene del callback de la linea "Usuario.findById(id, (err, usuario) => {"
                //en usuarioActualizado obtenemos todo el usuario incluyendo la constrasena
                //return es necesario salir de la funcion y evitar que continue procesando el resto de codigo
                usuario.save((err, usuarioActualizado) => {

                    usuarioActualizado.password = ':)';

                    if (err) {
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Imagen del usuarios actualizado',
                            usuario: usuarioActualizado
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        tipo: tipo,
                        id: id,
                        usuario: usuario,
                        pathViejo: pathViejo,
                        nombreArchivo: nombreArchivo
                    });

                });

            }

        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });

            } else {

                var pathViejo = '../uploads/hospitales/' + hospital.img;

                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hospitalActualizado) => {

                    if (err) {
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Imagen del hospital fue actualizada',
                            hosptial: hospitalActualizado
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        tipo: tipo,
                        id: id,
                        hospital: hospital,
                        pathViejo: pathViejo,
                        nombreArchivo: nombreArchivo
                    });
                });
            }
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {
            if (!medico) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });

            } else {

                var pathViejo = '../uploads/medicos/' + medico.img;

                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                medico.img = nombreArchivo;

                medico.save((err, medicoActializado) => {

                    if (err) {
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Imagen del hospital fue actualizada',
                            medico: medicoActualizado
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        tipo: tipo,
                        id: id,
                        medico: medico,
                        pathViejo: pathViejo,
                        nombreArchivo: nombreArchivo
                    });
                });


            }

        });


    }
}

module.exports = app;