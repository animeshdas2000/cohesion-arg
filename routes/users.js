const express = require ('express');
const router = express.Router ();
const user_controller = require ('../controllers/userController');
const auth = require ('../middlewares/auth');

router.post ('/signup', user_controller.signup);

router.post ('/signin', user_controller.signin);

module.exports = router;
