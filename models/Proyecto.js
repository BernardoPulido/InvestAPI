var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proyectoSchema = new Schema({
        titulo: {type:String},
        descripcion: {type:String},
        perfil_req: {type:String},
        estatus: {type:Boolean},
        palabras_clave: [{type:String}],
        fecha_limite: {type:Date},
        investigador: {
            type: Schema.Types.ObjectId,
            ref: 'Investigador',
            required: true
        }
    },
    {
        versionKey:false
    });

module.exports = mongoose.model('Proyecto', proyectoSchema);