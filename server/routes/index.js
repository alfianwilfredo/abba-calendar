var express = require('express');
var router = express.Router();
const eventRouter = require('./events');
/* GET home page. */
router.use('/events', eventRouter);

module.exports = router;
