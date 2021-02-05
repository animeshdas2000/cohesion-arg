const admin = require ('firebase-admin');
const rtdb = admin.database ();
const firestore = admin.firestore ();

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
      res
        // .cookie ('username', userData.name)
        // .cookie ('dob', userData.dob)
        // .cookie ('contact', userData.contact)
        // .cookie ('institution', userData.institution.toString ())
        // .cookie ('email', req.user.email)
        // .cookie ('arglevel', userData.arglevel)
        // .cookie ('ctflevel', userData.ctflevel)
        .render ('index', {user: userData.name});
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
    res.render ('arg', {
      level: level,
      user: snapshot.val ().name,
      question: arg[`${level}`]['question'],
    });
  });
  // FETCH QUESTION FROM DATABASE
  // firestore
  //   .collection ('arg')
  //   .doc (`${level}`)
  //   .get ()
  //   .then (function (doc) {
  //     res.render ('arg', {level: level, question: doc.data ().question});
  //   })
  //   .catch (function (error) {});
};

exports.argSubmit = function (req, res) {
  rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
    level = snapshot.val ().arglevel;
    if (arg[`${level}`]['answer'] == req.body.answer) {
      var newLevel = level + 1;
      var ref = firestore.collection ('users').doc (`${req.uid}`);
      ref.get ().then (function (doc) {
        ref.update ({
          arglevel: newLevel,
        });
      });
      rtdb.ref (`/${req.uid}`).update ({arglevel: newLevel});
      res.status (200).send ({
        msg: 'Correct Answer',
        level: newLevel,
        question: arg[`${newLevel}`]['question'],
      });
    } else {
      res.status (500).send ({
        msg: 'Incorrect!',
      });
    }
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

  // rtdb.ref ().orderByChild ('arglevel').once ('value', function (snapshot) {
  //   result = snapshot.val ();
  //   console.log (result.reverse ());
  //   console.log (result);
  //   res.send (result);
  // });
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
    question: ' I am the giant that dominates the world and daily lives of people. Kids in the kindergarten know about me. My name got changed because some old dude that helps everyone on the web messed up his and my identity. Not his fault though, cause it’s you people that mess up. I am the dream and I have the cream. Don’t need to tell that old dude’s name because you see him everyday like it’s your shrine, let’s see if you can name mine.',
    answer: 'Alphabet',
  },
  '1': {
    question: 'Hey there, probably like most of you I am single and I take up the central access memory in your PCs. You can call me an old Lady cause I got the lady parts and I indeed am old. My new counterpart is dimm-witted as per me but nowadays people use it to boost their pc performance',
    answer: 'SIMM',
  },
  '2': {
    question: 'Sed libero mi, auctor non egestas nec, sagittis nec ex. Suspendisse quis nisl at velit finibus dapibus sed eu nisi.',
    answer: 'IJKL',
  },
  '3': {
    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper tortor vel tortor aliquam, non congue leo blandit.',
    answer: 'MNOP',
  },
  '4': {
    question: 'https://www.fyrebox.com/play/jfra-grnv_pNq3enjVN',
    answer: 'QuizGrandChamp',
  },
  '5': {
    question: 'This monumental organization is celebrating its Diamond Anniversary this year. Just as Helena Ravenclaw said in Harry Potter and the Deathly Hallows,\"If you have to ask, you’ll never know. If you know, you need only ask.\"',
    answer: 'IEEE CS Society',
  },
  '6':{
    question:' https://youtu.be/Mz9Oe0W3XKo',
    answer:'NoRedHerrings',
  },
  '7':{
    question:'https://drive.google.com/file/d/1p3oTNKU3snvdddSM0hg-fBW3IZ8FBPXT/view?usp=sharing',
    answer:'Poggers',
  },
  '8':{
    question:'Red Herring Text:'
  }
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