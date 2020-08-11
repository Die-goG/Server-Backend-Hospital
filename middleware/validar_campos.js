// Estas funciones lo vamos a usar en las rutas: /routes

const { response } = require('express');
const { validationResult } = require('express-validator');


// el next se utliza para hacer que siga con el siguiente middleware
const validarCampos = (req, res = response, next) => {
    // Aqui voy a tomar todos los errores que fueron pasados por el middleware, y para atrapar esos errores necesitamos el
    // validatorResult de express-validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) { // si no esta vacio
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    // si no hay errores, ejecuto el next
    next();
};

//exportamos la funcion
module.exports = { validarCampos };