var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    messsage: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    usuario: {
        type: String,
        require: [true, 'El usuario es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El email es necesario']
    },
    password: {
        type: String,
        require: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        require: true,
        default: 'USER_ROLE'
    },
    google: { //si es true significa que el usuario se creo por google, false significa que no puede autenticarse por google
        //xq previamente ese email fue usado para autenticarse
        type: Boolean,
        default: false
    }

}, { collection: 'Usuario' });

usuarioSchema.plugin(uniqueValidator, { messsage: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);