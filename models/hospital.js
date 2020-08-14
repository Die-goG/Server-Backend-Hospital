const { Schema, model } = require('mongoose');

const hospitalSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El usuario es necesario']
    },
    img: {
        type: String,
        require: false
    },
    usuario: {
        require: true, // ningun hospital se va a guaradar si no tiene uid del usuarios que los esta guardandp 
        type: Schema.Types.ObjectId,
        ref: 'Usuario' // Usuario hace referencia a export en  models/usuario.js 
    }
}, { collection: 'Hospitales' }); // el nombre que irian en la coleccion en MongoDB


// visualizamos los datos de los usuarios la hacer get, excepto los que esta declarados en este metodo
hospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});


// ================================================
//  EXPORTAMOS
// ================================================
module.exports = model('Hospital', hospitalSchema);