var mongoose = require('mongoose');

var Instituciones = mongoose.model('Institucion');
var Investigadores = mongoose.model('Investigador');
var Proyecto = mongoose.model('Proyecto');

exports.getInstituciones = function(req, res, next){

    Instituciones.find(req.query, function (err, inst) {
        if(err){
            res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            console.log('GET /instituciones');
            res.status(200).jsonp(inst);
        }
    });
};

exports.addInstitucion = function(req, res, next){
    console.log('POST /instituciones');
    var inst = new Instituciones({
        institucion :req.body.institucion,
        abrev : req.body.abrev,
        direccion : req.body.direccion,
        entidad : req.body.entidad,
        lat : req.body.lat,
        lon : req.body.lon
    });

    inst.save(function (err, instituto) {
        if(err) return res.status(500).jsonp({error:'500', error_message:err.message});

        Instituciones.findById(instituto._id, function (err, inst) {
            if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
            res.status(200).jsonp(inst);
        })
    });
};

exports.getById = function(req, res, next){
    Instituciones.findById(req.params.id, function (err, inst) {
        if(err){
            return res.status(500).jsonp({error:'500', error_message:err.message});
        }
        if(inst){
            console.log('GET /instituciones:id');
            return res.status(200).jsonp(inst);
        }else{
            return res.status(500).jsonp({error:'500', error_message:"Institución no existente"});
        }
    });
};

exports.updateInstitucion = function(req, res, next){
    console.log('PUT /instituciones/:id');
    console.log(req.params.id);
    console.log(req.body);

    Instituciones.findById(req.params.id,function (err, inst) {
        if(err){
            res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            req.body.institucion?inst.institucion = req.body.institucion:null;
            req.body.abrev?inst.abrev = req.body.abrev:null;
            req.body.direccion?inst.direccion = req.body.direccion:null;
            req.body.entidad?inst.entidad = req.body.entidad:null;
            req.body.lat?inst.lat = req.body.lat:null;
            req.body.lon?inst.lon = req.body.lon:null;

            inst.save(function (err, inst) {
                if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
                Instituciones.findById(inst._id, function (err, inst) {
                    if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
                    res.status(200).jsonp(inst);
                })
            });
        }
    });
};

exports.deleteInstitucion = function(req, res, next){
    console.log('DELETE /instituciones/:id');
    console.log(req.params.id);

    Instituciones.findById(req.params.id, function (err, inst) {
        if(err || !inst){
            return res.status(500).jsonp({error:'505', error_message:"Registro no existente."});
        }else {
            Investigadores.find({'institucion': req.params.id}, function (err, inv) {
                inv.forEach(function (t) {
                    Proyecto.find({'investigador': t._id}).remove().exec(function (err, proyectos) {});
                });
            });

            Investigadores.find({'institucion': req.params.id}).remove().exec(function (err, inv) {
                Instituciones.findByIdAndRemove(req.params.id, function (err, inst) {
                    if (err) {
                        return res.status(500).jsonp({error: '500', error_message: err.message});
                    } else {
                        res.status(200).jsonp({res: '200', res_message: 'Ok. Registro eliminado correctamente'});
                    }
                });
            });
        }
    });

};

exports.getInvestigadoresPorInstitucion = function (req, res, next) {

    console.log('GET /instituciones/:id/investigadores');

    Investigadores.find({'institucion':req.params.id}).populate('institucion').exec(function (err, inv) {
        if(err){
            return res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            if(inv.length==0){
                return res.status(500).jsonp({error:'500', error_message:"Actualmente no se cuenta invesigadores registrados en dicha institución."});
            }else{
                return res.status(200).jsonp(inv);
            }
        }
    });
};
