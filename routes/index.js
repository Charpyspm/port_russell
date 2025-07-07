var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');

/* GET home page. */
router.get('/', (req, res) => {
    res.render('pages/index', { title: 'Port Russell' });
});

module.exports = router;
