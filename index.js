var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//*********************
// Server Index Config
//*********************
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

//*********************
// Body-Parser
//*********************

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//*********************
// Importamos las rutas
//*********************

var appRoutes = require('./routes/app');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var busquedaRoutes = require('./routes/busqueda');
var imagenesRoutes = require('./routes/imagenes');


//*********************
// Middleware
//*********************

app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

//*********************
// Conexion con DB
//*********************

mongoose.connect('mongodb://localhost:27017/Hospital', (err, res) => {
    if (err)
        throw err;
    console.log('Base de datos\x1b[32m%s\x1b[0m', ' Online..');
});

//*********************
// Aplicacion escuchando
//*********************

app.listen(3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m', ' Online..');
});