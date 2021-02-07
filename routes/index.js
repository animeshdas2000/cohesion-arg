var express = require ('express');
var router = express.Router ();
const auth = require ('../middlewares/auth');
const prodAuth = require ('../middlewares/prodAuth');
const index_controller = require ('../controllers/indexController');

// router.get ('/', auth, index_controller.index);
router.get ('/', auth, (req, res) => {
  res.redirect ('thankYou');
});

// router.get ('/register', index_controller.register);

// router.get ('/register/success', function (req, res, next) {
//   res.render ('registrationsuccess');
// });

router.get ('/ctf/challenge', prodAuth, index_controller.ctfChallenge);
router.get ('/arg', prodAuth, index_controller.arg);
router.get ('/arg/false', prodAuth, index_controller.argfalse);
router.get ('/arg/true', prodAuth, index_controller.argtrue);
router.post ('/arg/submit', prodAuth, index_controller.argSubmit);
router.get ('/arg/leaderboard', prodAuth, index_controller.argLeaderboard);

router.get ('/ctf', prodAuth, index_controller.ctf);
router.post ('/ctf/submit', prodAuth, index_controller.ctfSubmit);
router.get ('/ctf/leaderboard', prodAuth, index_controller.ctfLeaderboard);

router.get ('/GGEZ', prodAuth, index_controller.ggez);
router.get ('/ggez', prodAuth, index_controller.ggez);
router.get ('/arg/ggez', prodAuth, index_controller.ggez);
router.get ('/arg/GGEZ', prodAuth, index_controller.ggez);

router.get ('/login', index_controller.login);
router.get ('/thankYou', auth, (req, res) => {
  res.render ('thank-you-ctf',{email:req.user.email});
});

module.exports = router;
