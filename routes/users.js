var express = require('express');
var router = express.Router();

const service = require('../services/users');

router.get('/:id', service.getById);

router.post('/add', service.add);

router.patch('/:id', service.update);

router.delete('/:id', service.delete);

// ajout de la route /authenticate
router.post('/authenticate', service.authenticate);

module.exports = router;


// to do : mettre en place la fonction de login