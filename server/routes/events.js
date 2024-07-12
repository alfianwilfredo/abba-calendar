var express = require('express');
var router = express.Router();
const eventController = require('../controllers/event');
/* GET users listing. */
router.post('/store', eventController.store)
.get('/lists', eventController.lists)
.get('/details', eventController.details)

module.exports = router;
