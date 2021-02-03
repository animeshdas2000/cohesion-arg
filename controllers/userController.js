const firebase = require ('firebase').default;
const nodemailer = require ('nodemailer');
const ejs = require ('ejs');
/** @type {import("express").RequestHandler} */

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
      response.user.updateProfile ({
        displayName: req.body.name,
      });
      sendEmail (req.body.name, req.body.email);
      res.status (200).send ({msg: 'Registration successful!'});
    })
    .catch (function (error) {
      res.status (406).send ({msg: error.toString ()});
    });
};

exports.update = function (req, res) {};

function sendEmail (name, email) {
  let transporter = nodemailer.createTransport ({
    service: 'Gmail',
    auth: {
      user: 'cohesion2021@gmail.com',
      pass: 'C0he$!0n2021',
    },
    from: 'Cohesion 2021',
  });
  ejs.renderFile (
    'public/pages/Registration-Success.html',
    {name: name},
    function (err, data) {
      if (err) {
      } else {
        var mainOptions = {
          to: email,
          subject: '[COHESION] Registration Successfull!',
          html: data,
        };
        transporter.sendMail (mainOptions, function (err, info) {
          if (err) {
          } else {
          }
        });
      }
    }
  );
}
