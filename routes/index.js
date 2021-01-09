var express = require('express');
var router = express.Router();
const index_controller = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ARG' });
});

router.get ("/register", index_controller.register);

module.exports = router;
