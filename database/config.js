// ****************************
//  Configuracion de moongose
// ****************************

const mongoose = require('mongoose');

require('dotenv').config();

// funcion que establecera la conexion
const dbConnection = async() => {

    try {
        // cadena de conexion a db
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online MongoDb Atlas... :)');
    } catch (error) {
        console.log(err);
        throw new Error('Error a la hora de iniciar la BD .. :(');
    }

};

// Exportamos como un objeto la funcion
module.exports = {
    dbConnection
};