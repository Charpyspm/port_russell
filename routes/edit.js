const express = require('express');
const private = require('../middlewares/private');
const router = express.Router();

// Route protégée pour la page d'édition du profil
router.get('/', private.checkJWT, (req, res) => {
  res.render('pages/edit', { user: req.decoded.user });
});

module.exports = router;
