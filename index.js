var express = require('express');

//importamos el archivo con las variables de entornos .env
require('dotenv').config();

var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//************************************
// Soluciona el problema de las
// peticiones http
//************************************
const cors = require('cors');


const { dbConnection } = require('./database/config'); //asi importamos de forma desestructurada xq luego puedo añadir nuevas cosas

//************************************
// Conexion con MongoDB Atlas (cloud) 
//************************************
dbConnection();


//************************************
// Directorio Publico
//************************************
// public: nombre del directorio
app.use(express.static('public'));

//*********************
// Server Index Config
//*********************
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//*********************
// Body-Parser
//*********************
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// vemos todas las variables de entorno las default y las que creamos en nuestro proyecto
// console.log(process.env);

//*********************
// Importamos las rutas
//*********************
//var appRoutes = require('./routes/app');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var busquedaRoutes = require('./routes/busqueda');
var imagenesRoutes = require('./routes/imagenes');


//*********************
// Middleware: cualquier peticion que llegue a /login va a ser respondida por loginRoutes es decir por "./routes/app"
//*********************
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/todo', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
//app.use('/', appRoutes);




//*****************************
// Conexion con DB localhost
//*****************************
// mongoose.set('useFindAndModify', false); // por el warning
// mongoose.connect('mongodb://localhost:27017/Hospital', (err, res) => {

//     if (err)
//         throw err;
//     console.log('Base de datos locahost \x1b[32m%s\x1b[0m', ' Online..');

// });



//**********************
// Aplicacion escuchando
//**********************

app.listen(process.env.PORT, () => {
    console.log('Express server en el puerto .\x1b[32m%s\x1b[0m' + process.env.PORT, ' Online..');
});