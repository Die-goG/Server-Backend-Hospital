const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({

    usuario: {
        type: String,
        require: [true, 'El usuario es necesario']
    },
    email: {
        type: String,
        unique: true, // debera haber solo un email regisstrado en el sistema
        require: [true, 'El email es necesario'] //  el campo es requerido
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


// visualizamos los datos de los usuarios la hacer get, excepto los que esta declarados en este metodo
usuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

// ================================================
//  EXPORTAMOS
// ================================================
module.exports = model('Usuario', usuarioSchema);