const express = require('express');
const private = require('../middlewares/private');
const router = express.Router();

// Route protégée pour le dashboard
router.get('/', private.checkJWT, (req, res) => {
  const user = req.decoded.user;
  const today = new Date().toLocaleDateString('fr-FR');
  res.render('pages/dashboard', { user, today });
});

module.exports = router;
