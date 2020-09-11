// ================================================
//  Ruta: /busqueda
// ================================================
// ================================================
//  Ruta: /todo
// ================================================

const Route = require('express');
const { getBusqueda, getColeccion } = require('../controllers/busqueda');
const { validarJWT } = require('../middleware/validar_jwt');
const router = Route();

// ================================================
//  GET : Busqueda 
//                 (busqueda es los vamos a enviar) 
// ================================================

router.get('/:busqueda', validarJWT, getBusqueda);

// ================================================
//  GET : Busqueda por coleccion
//                 (busqueda es los vamos a enviar) 
//                 (tabla es la coleccion)
// ================================================

router.get('/:tabla/:busqueda', validarJWT, getColeccion);



// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;