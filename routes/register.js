const express = require('express');
const private = require('../middlewares/private');
const router = express.Router();

// Route protégée pour la page d'inscription
router.get('/', private.checkJWT, (req, res) => {
  res.render('pages/register');
});

module.exports = router;
