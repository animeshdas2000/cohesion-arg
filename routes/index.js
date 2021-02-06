var express = require ('express');
var router = express.Router ();
const auth = require ('../middlewares/auth');
const prodAuth = require ('../middlewares/prod-auth');
const index_controller = require ('../controllers/indexController');

router.get ('/', auth, index_controller.index);

router.get ('/register', index_controller.register);

router.get ('/register/success', function (req, res, next) {
  res.render ('registrationsuccess');
});

router.get('/ctf/challenge',prodAuth,index_controller.ctfChallenge);
router.get ('/arg', prodAuth, index_controller.arg);
router.get ('/arg/false', prodAuth, index_controller.argfalse);
router.get ('/arg/true', prodAuth, index_controller.argtrue);
router.post ('/arg/submit', prodAuth, index_controller.argSubmit);
router.get ('/arg/leaderboard', auth, index_controller.argLeaderboard);

router.get ('/ctf', prodAuth, index_controller.ctf);
router.post ('/ctf/submit', prodAuth, index_controller.ctfSubmit);
router.get ('/ctf/leaderboard', auth, index_controller.ctfLeaderboard);

router.get ('/GGEZ',prodAuth,index_controller.ggez)
router.get ('/ggez',prodAuth,index_controller.ggez)
router.get ('/arg/ggez',prodAuth,index_controller.ggez)
router.get ('/arg/GGEZ',prodAuth,index_controller.ggez)

router.get ('/login', index_controller.login);

module.exports = router;
