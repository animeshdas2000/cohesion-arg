var express = require ('express');
var router = express.Router ();
const auth = require ('../middlewares/auth');
const index_controller = require ('../controllers/indexController');

/* GET home page. */
router.get ('/', auth, index_controller.index);

router.get ('/register', index_controller.register);

router.get ('/register/success', function (req, res, next) {
  res.render ('registrationsuccess');
});

router.get ('/leaderboard', (req, res) => {
  res.render ('leaderboard.ejs');
});
router.get('/ctf/challenge',auth,(req,res)=>{
  res.render('ctfChallenge.ejs');
});
router.get ('/arg', auth, index_controller.arg);
router.get ('/arg/false', auth, index_controller.argfalse);
router.get ('/arg/true', auth, index_controller.argtrue);
router.post ('/arg/submit', auth, index_controller.argSubmit);
router.get ('/arg/leaderboard', auth, index_controller.argLeaderboard);

router.get ('/ctf', auth, index_controller.ctf);
router.post ('/ctf/submit', auth, index_controller.ctfSubmit);
router.get ('/ctf/leaderboard', auth, index_controller.ctfLeaderboard);

router.get ('/GGEZ',auth,index_controller.ggez)
router.get ('/ggez',auth,index_controller.ggez)
router.get ('/arg/ggez',auth,index_controller.ggez)
router.get ('/arg/GGEZ',auth,index_controller.ggez)

router.get ('/login', index_controller.login);
router.get('/arg/crossword',auth,)

module.exports = router;
