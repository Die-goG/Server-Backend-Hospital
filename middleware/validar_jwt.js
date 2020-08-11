const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) => {

    //Leer el token de los headers, para probar debemos especificar Headers en el POSTMAN
    const token = req.header('x-token');

    console.log(token);

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


module.exports = {
    validarJWT
};