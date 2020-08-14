// ================================================
//  Ruta: /upload
// ================================================

const Route = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middleware/validar_jwt');
const { subirArhivos, verArchivos } = require('../controllers/upload');
const router = Route();


// ================================================
//  PUT : Subir archivos 
// ================================================

router.use(expressFileUpload()); // este middleware ayuda a tener acceso a los archivos
router.put('/:tipo/:id', validarJWT, subirArhivos);

// ================================================
//  GET : Ver archivos 
// ================================================

router.get('/:tipo/:foto', verArchivos);

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = router;