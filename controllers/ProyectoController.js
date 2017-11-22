var mongoose = require('mongoose');

var Investigadores = mongoose.model('Investigador');
var Proyectos = mongoose.model('Proyecto');

exports.getProyectos = function(req, res, next){
    Proyectos.find(req.query).populate({
        path: 'investigador',
        model: 'Investigador',
        populate: [{
            path: 'institucion',
            model: 'Institucion'
        }]
    }).exec(function (err, proyecto) {
        if(err){
            res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            console.log('GET /proyectos');
            res.status(200).jsonp(proyecto);
        }
    });
};

exports.addProyectos = function(req, res, next){
    console.log('POST /proyectos');
    var proyecto = new Proyectos({
        titulo :req.body.titulo,
        descrip : req.body.descrip,
        perfil_req : req.body.perfil_req,
        estatus : req.body.estatus,
        palabras_clave : req.body.palabras_clave,
        fecha_limite : req.body.fecha_limite,
        investigador : req.body.investigador
    });

    proyecto.save(function (err, proyecto) {
        if(err) return res.status(500).jsonp({error:'500', error_message:err.message});

        Proyectos.findById(proyecto._id).populate({
            path: 'investigador',
            model: 'Investigador',
            populate: [{
                path: 'institucion',
                model: 'Institucion'
            }]
        }).exec(function (err, proy) {
            if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
            res.status(200).jsonp(proy);
        })
    });
};
exports.getById = function(req, res, next){
    Proyectos.findById(req.params.id).populate({
        path: 'investigador',
        model: 'Investigador',
        populate: [{
            path: 'institucion',
            model: 'Institucion'
        }]
    }).exec(function (err, proyecto) {
        if(err){
            return res.status(500).jsonp({error:'500', error_message:err.message});
        }
        if(proyecto){
            console.log('GET /proyectos:id');
            return res.status(200).jsonp(proyecto);
        }else{
            return res.status(500).jsonp({error:'500', error_message:"Proyecto no existente"});
        }
    });
};
exports.updateProyecto = function(req, res, next){
    console.log('PUT /proyectos/:id');
    console.log(req.params.id);
    console.log(req.body);

    Proyectos.findById(req.params.id,function (err, proyecto) {
        if(err){
            res.status(500).jsonp({error:'500', error_message:err.message});
        }else{
            req.body.titulo?proyecto.titulo = req.body.titulo:null;
            req.body.descripcion?proyecto.descripcion = req.body.descripcion:null;
            req.body.perfil_req?proyecto.perfil_req = req.body.perfil_req:null;
            req.body.estatus?proyecto.estatus = req.body.estatus:null;
            req.body.palabras_clave?proyecto.palabras_clave = req.body.palabras_clave:null;
            req.body.fecha_limite?proyecto.fecha_limite = req.body.fecha_limite:null;
            req.body.investigador?proyecto.investigador = req.body.investigador:null;


            proyecto.save(function (err, proyecto) {
                if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
                Proyectos.findById(proyecto._id).populate({
                    path: 'investigador',
                    model: 'Investigador',
                    populate: [{
                        path: 'institucion',
                        model: 'Institucion'
                    }]
                }).exec(function (err, proy) {
                    if(err) return res.status(500).jsonp({error:'500', error_message:err.message});
                    res.status(200).jsonp(proy);
                })
            });
        }
    });
};
exports.deleteProyecto = function(req, res, next){
    console.log('DELETE /proyectos/:id');
    console.log(req.params.id);

    Proyectos.findByIdAndRemove(req.params.id).populate({
        path: 'investigador',
        model: 'Investigador',
        populate: [{
            path: 'institucion',
            model: 'Institucion'
        }]
    }).exec(function (err, proy) {
        if(err){
            res.status(500).jsonp({error:'500', error_message:'Proyecto no existente.'});
        }else{
            res.status(200).jsonp({res:'200', res_message:'Ok. Proyecto eliminado correctamente'});
        }
    });
};
