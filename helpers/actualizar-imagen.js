// ================================================
//  Actualizamos la Db con el noombre de la imagen
// ================================================
const fs = require('fs'); //leemos el filesystem
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

let pathViejo = '';
const borrarImagen = (path) => {
    if (fs.existsSync(pathViejo)) {
        //borramos la imagen anterior
        fs.unlinkSync(pathViejo);
    }
};

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No se encontro medico por id');
                return false;
            }
            //Verificamos si el medico ya tiene imagen
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            // return true;

            break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No se encontro hospital por id');
                return false;
            }
            //Verificamos si el medico ya tiene imagen
            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            // return true;
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No se encontro usuario por id');
                return false;
            }
            //Verificamos si el medico ya tiene imagen
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            // return true;
            break;

        default:
            break;
    }

};

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = { actualizarImagen };