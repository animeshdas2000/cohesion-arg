const admin = require ('firebase-admin');
const rtdb = admin.database ();
const firestore = admin.firestore ();
const nodemailer = require ('nodemailer');

/** @type {import("express").RequestHandler} */
exports.index = function (req, res) {
  var userData;
  var ref = firestore.collection ('users').doc (`${req.uid}`);
  ref
    .get ()
    .then (function (doc) {
      userData = doc.data ();
      if (!userData.hasOwnProperty ('arglevel')) {
        ref
          .update ({
            arglevel: 0,
            ctflevel: 0,
          })
          .then (function () {
            rtdb.ref ().child (req.uid).set ({
              name: req.user.displayName,
              arglevel: 0,
              ctflevel: 0,
            });
          })
          .catch (function (error) {
            console.error (error.message);
          });
        userData = {...userData, arglevel: 0, ctflevel: 0};
      }
      res.render ('index', {user: userData.name});
    })
    .catch (function (error) {
      console.log (error.message);
    });
};

exports.register = function (req, res) {
  res.render ('register');
};

exports.login = (req, res) => {
  res.render ('login');
};

exports.arg = function (req, res) {
  rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
    level = snapshot.val ().arglevel;
    if (level == 9) res.redirect ('/arg/false');
    else
      res.render ('arg', {
        level: level,
        user: snapshot.val ().name,
        question: arg[`${level}`]['question'],
      });
  });
};

exports.argfalse = function (req, res) {
  rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
    level = snapshot.val ().arglevel;
    if (level != 9) res.redirect ('/arg');
    else
      res.render ('arg9', {
        level: '9',
        user: snapshot.val ().name,
        question: 'Don’t be so negative about everything!',
      });
  });
};

exports.argtrue = function (req, res) {
  rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
    level = snapshot.val ().arglevel;
    if (level != 9) res.redirect ('/arg');
    else
      res.render ('arg', {
        level: level,
        user: snapshot.val ().name,
        question: arg[`${level}`]['question'],
      });
  });
};

exports.argSubmit = function (req, res) {
  rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
    level = snapshot.val ().arglevel;
    var ref = firestore.collection ('users').doc (`${req.uid}`);
    if (arg[`${level}`]['answer'] == req.body.answer) {
      var newLevel = level + 1;
      ref.get ().then (function (doc) {
        ref.update ({
          arglevel: newLevel,
          argtime: admin.firestore.FieldValue.arrayUnion (Date.now ()),
        });
      });
      rtdb.ref (`/${req.uid}`).update ({arglevel: newLevel});
      if (newLevel == 3) sendThird (req.user.email);
      if (newLevel == 15) res.redirect ('/arg');
      res.status (200).send ({
        msg: 'Correct Answer',
        level: newLevel,
        question: arg[`${newLevel}`]['question'],
      });
    } else {
      ref.get ().then (function (doc) {
        ref.update ({
          argtry: admin.firestore.FieldValue.arrayUnion (req.body.answer),
        });
      });
      res.status (500).send ({
        msg: 'Incorrect!',
      });
    }
  });
};

function sendThird (email) {
  let transporter = nodemailer.createTransport ({
    service: 'Gmail',
    auth: {
      user: 'cohesion2021@gmail.com',
      pass: 'C0he$!0n2021',
    },
    from: 'Cohesion 2021',
  });
  var mainOptions = {
    to: email,
    subject: '“Protection”',
    html: 'Follow the link to be led to the answer.\n https://www.fyrebox.com/play/jfra-grnv_pNq3enjVN',
  };
  transporter.sendMail (mainOptions, function (err, info) {
    if (err) {
      console.log (`Not sent to ${email}`);
    } else {
    }
  });
}

exports.ggez = (req, res, next) => {
  rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
    level = snapshot.val ().arglevel;
    if (level == 14) {
      var ref = firestore.collection ('users').doc (`${req.uid}`);
      var newLevel = level + 1;
      ref.get ().then (function (doc) {
        ref.update ({
          arglevel: newLevel,
          argtime: admin.firestore.FieldValue.arrayUnion (Date.now ()),
        });
      });
      rtdb.ref (`/${req.uid}`).update ({arglevel: newLevel});
      res.status (200).redirect ('/arg');
    } else res.redirect ('/arg');
  });
};

exports.argLeaderboard = (req, res) => {
  firestore
    .collection ('users')
    .orderBy ('arglevel', 'desc')
    .select ('name', 'arglevel')
    .get ()
    .then (function (querySnapshot) {
      leaderboard = [];
      querySnapshot.forEach (function (doc) {
        leaderboard.push (doc.data ());
        // console.log (doc.data ());
      });
      res.render ('argLeaderboard', {leaderboard});
    })
    .catch (function (error) {
      console.log (error);
    });
};

exports.ctf = (req, res) => {
  res.render ('ctf', {detial: req.user});
};

exports.ctfSubmit = (req, res) => {
  res.status (404).send ("Don't be oversmart :) ");
};

exports.ctfLeaderboard = (req, res) => {};

var arg = {
  '0': {
    question: 'I am the giant that dominates the world and daily lives of people. <br> Kids in the kindergarten know about me. <br> My name got changed because some old dude that helps everyone on the web messed up his and my identity. <br> Not his fault though, cause it’s you people that mess up. <br> I am the dream and I have the cream. <br> Don’t need to tell that old dude’s name because you see him everyday like it’s your shrine, let’s see if you can name mine.',
    answer: 'ALPHABET',
  },
  '1': {
    question: 'Hey there, probably like most of you I am single and I take up the central access memory in your PCs.  <br>  You can call me an old Lady cause I got the lady parts and I indeed am old. <br> My new counterpart is dimm-witted as per me but nowadays people use it to boost their pc performance.',
    answer: 'SIMM',
  },
  '2': {
    question: '<img src="https://i.ibb.co/S3JNv1V/image.jpg"/><br><br><img src="https://i.ibb.co/zXsnnxv/image-1.jpg"/>',
    answer: 'QCERT',
  },
  '3': {
    question: 'You’ve received the details for this question, time for you to find out where!',
    answer: 'QUIZGRANDCHAMP',
  },
  '4': {
    question: 'This monumental organization is celebrating its Diamond Anniversary this year.<br><br>Just as Helena Ravenclaw said in Harry Potter and the Deathly Hallows, "If you have to ask, you’ll never know. If you know, you need only ask. ',
    answer: 'IEEE CS',
  },
  '5': {
    question: '<a href="https://youtu.be/Mz9Oe0W3XKo" target="_blank" rel="noopener noreferrer" >And off we go to the confusing world!</a>',
    answer: 'NOREDHERRINGS',
  },
  '6': {
    question: '<a href="https://drive.google.com/file/d/1p3oTNKU3snvdddSM0hg-fBW3IZ8FBPXT/view?usp=sharing" target="_blank" rel="noopener noreferrer" >You’re doing good, only 13 more questions to go!</a>',
    answer: 'POGGERS',
  },
  '7': {
    question: 'Two roads diverged in a yellow wood,<br>And sorry I could not travel both<br>And be one traveler, long I stood<br>And looked down one as far as I could<br>To where it bent in the undergrowth;<br>Then took the other, as just as fair,<br>And having perhaps the better claim',
    answer: 'SNEAKYSNEAKY',
  },
  '8': {
    question: 'The answer is somewhere on this webpage, time for you to find out where!',
    answer: 'ANIMENOTFOREVERYONE',
  },
  '9': {
    question: 'Whoa, you made it to the correct place! But looks like you left the correct answer in the previous place :( I hope you find it though',
    answer: 'SECURITY',
  },
  '10': {
    question: '<a href="https://drive.google.com/file/d/148-dZN7rgGcNHXGkhpBJmE16pZ_GS-hw/view?usp=sharing" target="_blank" rel="noopener noreferrer" >In other news, DogeCoin is going up in value</a>',
    answer: 'PRONOTEPAD',
  },
  '11': {
    question: '<a href="https://drive.google.com/file/d/1413jQ8hFPkDv3vs1LhYF_t1RxuG7dEOB/view?usp=sharing" target="_blank" rel="noopener noreferrer" >Too many questions, too left answers</a>',
    answer: 'INVERTEDCODE',
  },
  '12': {
    question: '<a href="https://pastebin.com/kmctjE2C" target="_blank" rel="noopener noreferrer" >The final countdown</a>',
    answer: 'TOOMANYCONVERSIONS',
  },
  '13': {
    question: '<a href="https://pastebin.com/RaqanVAn" target="_blank" rel="noopener noreferrer" >I really hope someone makes it this far</a>',
    answer: 'SCANNYBOI',
  },
  '14': {
    question: '<a href="https://drive.google.com/file/d/1luFVfCECahZG2n8KBoG8WSUjAaoWw-TM/view?usp=sharing" target="_blank" rel="noopener noreferrer" >One More Time ♫  </a>',
    answer: 'anantgulia',
  },
  '15': {
    question: '<a href="https://drive.google.com/file/d/1Wsspt8xPowDXPYHsBtMQHRuGqCNUfIkr/view?usp=sharing" target="_blank" rel="noopener noreferrer" >Good movie</a>',
    answer: 'CATCHMEIFYOUCAN',
  },
  '16': {
    question: '----------]<-<---<-------<---------->>>>+[<<<<-----------------,>>-----------------,<<---,++++++++++++,-------,---,++++++++++++++,----------,++++++,-,',
    answer: 'TOOMUCHBRAINFUCK',
  },
  '17': {
    question: '<a href="https://drive.google.com/file/d/1L1QzQ8kqJG75hqJD26V70TLcrDVFI5SX/view?usp=sharing" target="_blank" rel="noopener noreferrer" >Dawn of the Final Day</a>',
    answer: 'NICELYDONE',
  },
  '18': {
    question: 'A man captivated by wiles was only captivated for a time, whereas a man won by simplicity would be won forever - if he, himself, were worth the winning.<br><br>92,1,6;<br>57,4,3;<br>170,17,28;<br>49,7,7;<br>365;15,8;<br>308,2,12;<br>444,20,5;<br>253,23,1;,<br>254,23,1',
    answer: 'NERDINESS',
  },
  '19': {
    question: 'Congratulations!',
    answer: 'Winner!',
  },
};

var ctf = {
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
    author:'',
  },
  '':{
    title:'',
    question:'',
    answer:'',
    driveId:'',
  },
  

}