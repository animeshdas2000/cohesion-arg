const firebase = require ('../db');
const nodemailer = require ('nodemailer');
const ejs = require ('ejs');

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
      sendEmail (req.body.name, req.body.email);
      res.status (200).send ({msg: 'Registration successful!'});
    })
    .catch (function (error) {
      res.status (406).send ({msg: error.toString ()});
    });
};

exports.signin = async function (req, res) {};

exports.signout = async function (req, res) {};

exports.update = function (req, res) {};

function sendEmail (name, email) {
  let transporter = nodemailer.createTransport ({
    service: 'Gmail',
    auth: {
      user: "cohesion2021@gmail.com",
      pass: "C0he$!0n2021",
    },
  });
  ejs.renderFile ("public/pages/Registration-Success.html", {name: name}, function (
    err,
    data
  ) {
    if (err) {
      console.log (err);
    } else {
      var mainOptions = {
        to: email,
        subject: '[COHESION] Successfully Registered!',
        html: data,
      };
      transporter.sendMail (mainOptions, function (err, info) {
        if (err) {
          console.log (err);
        } else {
          console.log ('Email Sent');
        }
      });
    }
  });
}
