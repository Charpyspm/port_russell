var express = require('express');
var router = express.Router();

const service = require('../services/users');

const private = require('../middlewares/private');

router.get('/me', private.checkJWT, async (req, res) => {
  console.log('decoded', req.decoded);
  const user = req.decoded && req.decoded.user;
  if (user) {
    res.json({ _id: user._id, username: user.username, email: user.email });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/:id', private.checkJWT, service.getById);

router.post('/add', service.add);

router.patch('/:id', private.checkJWT, service.update);

router.delete('/me', private.checkJWT, service.deleteMe);

router.post('/login', service.authenticate);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message : ' disconnected'});
});


module.exports = router;