const firebase = require ('../db');

exports.signup = async function (req, res) {
  firebase
    .auth ()
    .createUserWithEmailAndPassword (req.body.email, req.body.password)
    .then (function (response) {
      firebase.firestore ().collection ('users').doc (response.user.uid).set ({
        name: req.body.name,
        institution: req.body.institution,
        contact: req.body.contact,
        dob: req.body.dob,
      });
      res.status (200).send ({msg: 'Registration successful!'});
    })
    .catch (function (error) {
      res.status (406).send ({msg: error.toString ()});
    });
};

exports.signin = async function (req, res) {};

exports.signout = async function (req, res) {};

exports.update = function (req, res) {};
