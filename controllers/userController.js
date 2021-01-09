const firebase = require ('../db');

exports.signup = async function (req, res) {
  console.log (req.body);
  firebase
    .auth ()
    .createUserWithEmailAndPassword (req.body.email, req.body.password)
    // .signInWithEmailAndPassword (req.body.email, req.body.password)
    .then (function (response) {
      firebase.firestore ().collection ('users').doc (response.user.uid).set ({
        attribute: 'value',
      });
      res.status (200).send ({msg: 'Registration successful!'});
    })
    .catch (function (error) {
      console.log (error);
      res.status (404).send ({msg: 'Some error occured!'});
    });
};

exports.signin = async function (req, res) {};

exports.signout = async function (req, res) {};

exports.update = function (req, res) {};
