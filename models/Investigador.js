var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invSchema = new Schema({
        nombre: {type:String},
        apellidos: {type:String},
        grado: {type:String},
        institucion: {
            type: Schema.Types.ObjectId,
            ref: 'Institucion',
            required: true
        },
        email: {type:String},
        cvu: {type:String},
    },
    {
        versionKey:false
    });

module.exports = mongoose.model('Investigador', invSchema);