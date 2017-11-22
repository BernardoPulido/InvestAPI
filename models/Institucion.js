var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var institucionSchema = new Schema({
        institucion: {type:String},
        abrev: {type:String},
        direccion: {type:String},
        entidad: {type:String},
        lat: {type:Number},
        lon: {type:Number}
    },
    {
        versionKey:false
    });

module.exports = mongoose.model('Institucion', institucionSchema);