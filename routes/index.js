var express = require ('express');
var router = express.Router ();
const auth = require ('../middlewares/auth');
const index_controller = require ('../controllers/indexController');

/* GET home page. */
router.get ('/', auth, function (req, res, next) {
  res.render ('index', {details: req.user});
});

router.get ('/register', index_controller.register);

router.get ('/register/success', function (req, res, next) {
  res.render ('registrationsuccess');
});
router.get('/profile',auth,(req,res,next)=>{
  res.render('profile',{details:req.user});
})
router.get('/leaderboard',(req,res)=>{
  res.render('leaderboard.ejs');
})
router.get ('/login', index_controller.login);

module.exports = router;
