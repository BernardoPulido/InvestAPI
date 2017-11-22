var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer();
var modelsInstitucion = require('../models/Institucion');
var modelsInvestigador = require('../models/Investigador');
var modelsProyecto = require('../models/Proyecto');
var investigadorCtrl = require('../controllers/InvestigadorController');
var institucionCtrl = require('../controllers/InstitucionController');
var proyectoCtrl = require('../controllers/ProyectoController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/instituciones')
  .get(institucionCtrl.getInstituciones)
  .post(upload.array(), institucionCtrl.addInstitucion);

router.route('/instituciones/:id')
    .get(institucionCtrl.getById)
    .put(upload.array(), institucionCtrl.updateInstitucion)
    .delete(institucionCtrl.deleteInstitucion);

router.route('/instituciones/:id/investigadores')
    .get(institucionCtrl.getInvestigadoresPorInstitucion);

router.route('/investigadores')
    .get(investigadorCtrl.getInvestigadores)
    .post(upload.array(), investigadorCtrl.addInvestigadores);

router.route('/investigadores/:id')
    .get(investigadorCtrl.getById)
    .put(upload.array(), investigadorCtrl.updateInvestigador)
    .delete(investigadorCtrl.deleteInvestigador);

router.route('/investigadores/:id/proyectos')
    .get(investigadorCtrl.getProyectosPorInvestigador);

router.route('/proyectos')
    .get(proyectoCtrl.getProyectos)
    .post(upload.array(), proyectoCtrl.addProyectos);

router.route('/proyectos/:id')
    .get(proyectoCtrl.getById)
    .put(upload.array(), proyectoCtrl.updateProyecto)
    .delete(proyectoCtrl.deleteProyecto);

module.exports = router;
