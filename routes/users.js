var express = require('express');
var router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');

router.get('/:id', private.checkJWT, service.getById);

router.post('/add', service.add);

router.patch('/:id', private.checkJWT, service.update);

router.delete('/:id', private.checkJWT, service.delete);

// ajout de la route /authenticate
router.post('/authenticate', service.authenticate);

router.post('/add', service.add);

module.exports = router;


// to do : mettre en place la fonction de login