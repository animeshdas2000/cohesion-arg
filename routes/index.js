var express = require ('express');
var router = express.Router ();
const index_controller = require ('../controllers/indexController');

/* GET home page. */
router.get ('/', function (req, res, next) {
  res.render ('index', {title: 'Cohesion'});
});

router.get ('/register', index_controller.register);

router.get ('/register/success', function (req, res, next) {
  res.render ('registrationsuccess');
});


module.exports = router;
