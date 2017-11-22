var mongoose = require('mongoose');

var Instituciones = mongoose.model('Institucion');
var Investigadores = mongoose.model('Investigador');
var Proyecto = mongoose.model('Proyecto');

exports.getInvestigadores = function(req, res, next){
    Investigadores.find(req.query).populate('institucion').exec(function (err, inv) {
        if(err){
            res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            console.log('GET /investigadores');
            res.status(200).jsonp(inv);
        }
    });
};

exports.addInvestigadores = function(req, res, next){
    console.log('POST /investigadores');
    var inv = new Investigadores({
        nombre :req.body.nombre,
        apellidos : req.body.apellidos,
        grado : req.body.grado,
        institucion : req.body.institucion,
        email : req.body.email,
        cvu : req.body.cvu
    });

    inv.save(function (err, investigador) {
        if(err) return res.status(500).jsonp({error:'500', error_message:err.message});

        Investigadores.findById(investigador._id).populate('institucion').exec(function (err, inv) {
            if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
            res.status(200).jsonp(inv);
        })
    });
};

exports.getById = function(req, res, next){
    Investigadores.findById(req.params.id).populate('institucion').exec(function (err, inv) {
        if(err){
            return res.status(500).jsonp({error:'500', error_message:err.message});
        }
        if(inv){
            console.log('GET /investigadores:id');
            return res.status(200).jsonp(inv);
        }else{
            return res.status(500).jsonp({error:'500', error_message:"Investigador no existente"});
        }
    });
};
exports.updateInvestigador = function(req, res, next){
    console.log('PUT /investigadores/:id');
    console.log(req.params.id);
    console.log(req.body);

    Investigadores.findById(req.params.id,function (err, inv) {
        if(err || !inv){
            res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            req.body.nombre?inv.nombre = req.body.nombre:null;
            req.body.apellidos?inv.apellidos = req.body.apellidos:null;
            req.body.grado?inv.grado = req.body.grado:null;
            req.body.institucion?inv.institucion = req.body.institucion:null;
            req.body.email?inv.email = req.body.email:null;
            req.body.cvu?inv.cvu = req.body.cvu:null;


            inv.save(function (err, inv) {
                if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
                Investigadores.findById(inv._id).populate('institucion').exec(function (err, inv) {
                    if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
                    res.status(200).jsonp(inv);
                })
            });
        }
    });
};
exports.deleteInvestigador = function(req, res, next){
    console.log('DELETE /investigadores/:id');
    console.log(req.params.id);

    Investigadores.findById(req.params.id, function (err, inv) {
        if(err || !inv){
            return res.status(500).jsonp({error:'505', error_message:"Registro no existente."});
        }else {

            Proyecto.find({'investigador': req.params.id}).remove().exec(function (err, proyectos) {
                Investigadores.findByIdAndRemove(req.params.id, function (err, inv) {
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

exports.getProyectosPorInvestigador = function (req, res, next) {

    console.log('GET /investigadores/:id/proyectos');

    Proyecto.find({'investigador':req.params.id}).populate({
        path: 'investigador',
        model: 'Investigador',
        populate: [{
            path: 'institucion',
            model: 'Institucion'
        }]
    }).exec(function (err, proyectos) {
        if(err){
            return res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            if(proyectos.length==0){
                return res.status(500).jsonp({error:'500', error_message:"Actualmente dicho investigador no cuenta con proyectos almacendos.."});
            }else{
                return res.status(200).jsonp(proyectos);
            }
        }
    });
};

