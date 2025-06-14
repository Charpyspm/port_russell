var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');

/* GET home page. */
router.get('/', async(res, req) => {
    req.status(200).json({
      name: proccess.env.APP_NAME,
      version : process.env.APP_VERSION,
      status: 200,
      message: 'Welcome to PortRussell API',
    })
});

module.exports = router;
