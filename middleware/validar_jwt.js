const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


// ================================================
//  Validamos el token
// ================================================

const validarJWT = (req, res, next) => {

    //Leer el token de los headers, para probar debemos especificar Headers en el POSTMAN
    const token = req.header('x-token');

    //console.log(token);  ///motramos el token en la consola

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la solicitud ..'
        });
    }

    try {

        // obtenemos el uid que grabamos en el payload
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        // pasamos el valor de uid al getUsuario en /controllers/usuario.js
        req.uid = uid;
        next();

    } catch (error) { //se dispara este catch si el token no es valido
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

};

// ================================================
//  Validamos que el logeado sea un usuario ADMIN
// ================================================

const validarAdminRole = async(req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegio para hacer eso'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

};

const validarAdminRoleoMismoUsuario = async(req, res, next) => {

    const uid = req.uid; // id del usuario logeado
    const id = req.params.id; // Id que quiero actulizar 

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role === 'ADMIN' || uid === id) {

            next();

        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegio para hacer eso'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

};

module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRoleoMismoUsuario
};