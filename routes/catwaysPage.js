const express = require('express');
const private = require('../middlewares/private');
const router = express.Router();

// Route protégée pour la page catways
router.get('/', private.checkJWT, (req, res) => {
  res.render('pages/catways');
});

module.exports = router;
