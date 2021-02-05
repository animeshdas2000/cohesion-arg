/** @type {import("express").RequestHandler} */
const admin = require ('firebase-admin');
const auth = admin.auth ();
const firestore = admin.firestore ();
module.exports = async function (req, res, next) {
  const uid = req.cookies.uid;
  if (uid == undefined) res.redirect ('/login');
  else {
    auth
      .getUser (uid)
      .then (userRecord => {
        req.uid = uid;
        req.user = userRecord.providerData[0];
        next ();
      })
      .catch (error => {
        res
          .cookie ('uid', '', {expires: new Date (Date.now ())})
          .redirect ('/login');
      });
  }
};
