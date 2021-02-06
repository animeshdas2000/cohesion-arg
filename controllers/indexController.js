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
            ctfdone: [],
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
    if (
      arg[`${level}`]['answer'] == req.body.answer ||
      'IEEECS' == req.body.answer
    ) {
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
  res.render ('ctf', {ctf});
};

exports.ctfChallenge = (req, res) => {
  res.render ('ctfChallenge', {challenge: req.query});
};

exports.ctfSubmit = (req, res) => {
  if (ctf[`${req.body.qid - 1}`]['flag'] == req.body.answer) {
    rtdb.ref (`/${req.uid}`).once ('value', function (snapshot) {
      points = snapshot.val ().ctflevel;
      var ref = firestore.collection ('users').doc (`${req.uid}`);
      var points = points + ctf[`${req.body.qid}`]['points'];
      ref.get ().then (function (doc) {
        if (doc.data ().ctfdone.includes (req.body.qid))
          res.send ({msg: 'You have already attempted this challenge :)'});
        else {
          ref.update ({
            ctflevel: points,
            ctfdone: admin.firestore.FieldValue.arrayUnion (req.body.qid),
            ctftime: admin.firestore.FieldValue.arrayUnion (Date.now ()),
          });
          rtdb.ref (`/${req.uid}`).update ({ctflevel: points});
          res.status (200).send ({
            msg: 'Correct Answer',
          });
        }
      });
    });
  } else {
    res.status (200).send ({
      msg: 'Incorrect Answer',
    });
  }
};

exports.ctfLeaderboard = (req, res) => {
  firestore
    .collection ('users')
    .orderBy ('ctflevel', 'desc')
    .select ('name', 'ctflevel')
    .get ()
    .then (function (querySnapshot) {
      leaderboard = [];
      querySnapshot.forEach (function (doc) {
        leaderboard.push (doc.data ());
      });
      res.render ('ctfLeaderboard', {leaderboard});
    })
    .catch (function (error) {
      console.log (error);
    });
};

var arg = {
  '0': {
    question: 'I am the giant that dominates the world and daily lives of people. <br> Kids in the kindergarten know about me. <br> My name got changed because some old dude that helps everyone on the web messed up his and my identity. <br> Not his fault though, cause it’s you people that mess up. <br> I am the dream and I have the cream. <br> Don’t need to tell that old dude’s name because you see him everyday like it’s your shrine, let’s see if you can name mine.',
    answer: 'ALPHABET',
  },
  '2': {
    question: 'Hey there, probably like most of you I am single and I take up the central access memory in your PCs.  <br>  You can call me an old Lady cause I got the lady parts and I indeed am old. <br> My new counterpart is dimm-witted as per me but nowadays people use it to boost their pc performance. <br> <br> Abbreviation accepted.',
    answer: 'SIMM',
  },
  '1': {
    question: 'Q1: Which cipher which rely on sophisticated gearing mechanism.<br><br>Q2: What is the most widely used encryption technique of modern times. <br><br> Give combined answer. ',
    answer: 'ENIGMARIJNDAEL',
  },
  '3': {
    question: 'You’ve received the details for this question, time for you to find out where!',
    answer: 'QUIZGRANDCHAMP',
  },
  '4': {
    question: 'This monumental organization is celebrating its Diamond Anniversary this year.<br><br>Just as Helena Ravenclaw said in Harry Potter and the Deathly Hallows, "If you have to ask, you’ll never know. If you know, you need only ask. ',
    answer: 'IEEECOMPUTERSOCIETY',
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
    question: '<a href="https://drive.google.com/file/d/1413jQ8hFPkDv3vs1LhYF_t1RxuG7dEOB/view?usp=sharing" target="_blank" rel="noopener noreferrer" >Too many questions, too few answers</a>',
    answer: 'INVERTEDCODE',
  },
  '12': {
    question: '<a href="https://docs.google.com/document/d/1JQxV2o3MUrgEf__UMh892QVTpm3ighmO4KsKl-PibLc/edit?usp=sharing" target="_blank" rel="noopener noreferrer" >The final countdown</a>',
    answer: 'TOOMANYCONVERSIONS',
  },
  '13': {
    question: '<a href="https://docs.google.com/document/d/1TMs2uJhJa_18-lqxNzKQ2cwcvqeVqMLGUeVOc3Oos6k/edit?usp=sharing" target="_blank" rel="noopener noreferrer" >I really hope someone makes it this far</a>',
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
    question: '"A man captivated by wiles was only captivated for a time, whereas a man won by simplicity would be won forever - if he, himself, were worth the winning."<br><br>92,1,6;<br>57,4,3;<br>170,17,28;<br>49,7,7;<br>365;15,8;<br>308,2,12;<br>444,20,5;<br>253,23,1;<br>254,23,1',
    answer: 'NERDINESS',
  },
  '19': {
    question: 'Congratulations!',
    answer: 'Winner!',
  },
};

var ctf = [
  {
    id: 1,
    title: 'Warm-Up - 1',
    question: 'Find the Fish',
    points: 30,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1nuUXiEVJTTF5QDxgcCjNl_qyLdHv7P4k',
    flag: 'cohesion.ctf{D34df1sh_1s_4wes0m3}',
    pholder:'cohesion.ctf{}',
    category: 'Crypto',
  },
  {
    id: 2,
    title: 'Warm-Up - 2',
    question: 'Baby ko base pasand hai',
    points: 30,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1kYKa3AtsnYP1iY8mA6md5T-E7veoJi3G',
    flag: 'cohesion.ctf{B4se_91_1s_Lub}',
    pholder:'cohesion.ctf{}',
    category: 'Crypto',
  },
  {
    id: 3,
    title: 'Warm-Up - 3',
    question: 'Mr.Z received a text file from his friend, but was unable to understand it can you decode it on his behalf it might give you the flag.',
    points: 50,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1r-EPzzEoULucaE4Vrc0fGIL-ZzQIsmii',
    flag: 'cohesion.ctf{M4lb0g3_1s_c00l}',
    pholder:'cohesion.ctf{}',
    category: 'Crypto',
  },
  {
    id: 4,
    title: 'Weird Sound',
    question: 'Recently the author got a message from his buddy but he thinks this is an encoded message can you decode it for him?',
    points: 100,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1fEd-JmqpRuYe6Xyi0A6yYfXsXWWUZsTL',
    flag: 'cohesion.ctf{DTMFTONESAREFUN}',
    pholder:'cohesion.ctf{}',
    category: 'Misc',
  },
  {
    id: 5,
    title: 'Basic Ciphers',
    question: 'Knowledge of some basic ciphers can be really useful.',
    points: 50,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1KvIF0VtfE5Q4R7lAaIY8y4tNWXaACWzD',
    flag: 'cohesion.ctf{N1c3_K33p_Going_Buddy}',
    pholder:'cohesion.ctf{}',
    category: 'Crypto',
  },
  {
    id: 6,
    title: 'AAR ESS AEEE',
    question: '',
    points: 150,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1nuUXiEVJTTF5QDxgcCjNl_qyLdHv7P4k',
    flag: 'cohesion.ctf{r5a_1s_3a5y}',
    pholder:'cohesion.ctf{}',
    category: 'Crypto',
  },
  {
    id: 7,
    title: 'What the hell is this?',
    question: 'So today I met John but he was very stressed as Jason who lives at 15 park street avenue 3rd road sent a text to John but it is encrypted and John cannot wrap his head around what possibly it could be, I want you to look at the text and see if you could help John?',
    points: 100,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=10TR6PWfs4WvAgYT88yF6A_p1nKmFnXlc',
    flag: 'ieeencu.ctf{Y0u_4r3_l33t}',
    pholder:'ieeencu.ctf{}',
    category: 'Crypto',
  },
  {
    id: 8,
    title: 'Decode This',
    question: '',
    points: 100,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1KvIF0VtfE5Q4R7lAaIY8y4tNWXaACWzD',
    flag: 'cohesion.ctf{pigpenisfun}',
    pholder:'cohesion.ctf{}',
    category: 'Crypto',
  },
  {
    id: 9,
    title: 'Find the Place',
    question: 'Recently my friend Emily went to a country that is less known to people but a beautiful destination. She clicked some pictures can you find which country she went to?',
    points: 50,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=14hFh4av_xPLiLkVHkkVCkIha-i8NCUAA',
    flag: 'cohesion.ctf{Montserrat}',
    pholder:'cohesion.ctf{}',
    category: 'OSINT',
  },
  {
    id: 10,
    title: 'Time Travel',
    question: 'Our intelligence has found about a hacker named Elliot Poulsen, he always speaks in hacker language and has recently posted some stuff on the internet about some hacks that have happened recently can you find out what he has leaked.',
    points: 150,
    author: '!nVoK3r',
    resource: null,
    flag: 'ieeencu.ctf{b3st_h4cker_0f_4ll_7ime}',
    pholder:'ieeencu.ctf{}',
    category: 'OSINT',
  },
  {
    id: 11,
    title: 'Who Am I',
    question: 'The author of the challenge is part of an organization, which has leaked some sensitive information on one of its social media account.',
    points: 100,
    author: '!nVoK3r',
    resource: null,
    flag: 'cohesion.ctf{Ariana_Grande_Butera}',
    pholder:'cohesion.ctf{}',
    category: 'OSINT',
  },
  {
    id: 12,
    title: 'Easy-Peasy',
    question: 'Can you tell me the IP address of a top netweaver product that is located in Germany.',
    points: 70,
    author: '!nVoK3r',
    resource: null,
    flag: 'cohesion.ctf{188.95.7.114}',
    pholder:'cohesion.ctf{}',
    category: 'OSINT',
  },
  {
    id: 13,
    title: 'OSINT Master',
    question: 'Show me what can you find with d0:31:69:90:a8:75 ?',
    points: 100,
    author: '!nVoK3r',
    resource: null,
    flag: 'cohesion.ctf{AndroidAP}',
    pholder:'cohesion.ctf{}',
    category: 'OSINT',
  },
  {
    id: 14,
    title: 'Lost Phone',
    question: 'Andrew lost his phone while he was on his way home but he was able to get some details back could you help me find the tower it was last found?',
    points: 100,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=18zUQ9F25TIDjZ6SUvweNmMCf41V1odM2',
    flag: 'cohesion.ctf{51.49,-0.08}',
    pholder:'cohesion.ctf{}',
    category: 'OSINT',
  },
  {
    id: 15,
    title: 'Storms',
    question: 'Can you tell me when this picture was taken?             Flag Format - cohesion.ctf{date_month_year_time}\nExample - cohesion.ctf{23_12_2021_11}',
    points: 100,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1eWkUqHPOaRZFbwPWQUTNA2F-SSnyHnsi',
    flag: 'cohesion.ctf{03_06_2020_15}',
    pholder:'cohesion.ctf{}',
    category: 'OSINT',
  },
  {
    id: 16,
    title: 'Zero Width',
    question: 'Hmm…There ‌‌‌‌‍‌‍might ‌‌‌‌‍ ‌be something ‌‌‌‌‍‌‍hiding there ‌‌‌‌‍‍‍‍.',
    points: 50,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1OysxhJYYBVUDVWnGYCAMkscTcCjvAG4T',
    flag: 'cohesion.ctf{Un1c0de_1s_l33t}',
    pholder:'cohesion.ctf{}',
    category: 'Misc',
  },
  {
    id: 17,
    title: 'Digital Ink',
    question: 'My friend gave me a picture but he always uses filterfirst before sending any picture. If you could find a tool that he used to hide data you will find the flag.',
    points: 50,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1vqPJrAirg86Ev--UrOWbJSVO0w9Y3eyK',
    flag: 'cohesion.ctf{D1git4l_1nk_4lw4ys_w0rks}',
    pholder:'cohesion.ctf{}',
    category: 'Misc',
  },
  {
    id: 18,
    title: 'Deception',
    question: 'Can you find the flag I think not',
    points: 200,
    author: '!nVoK3r',
    resource: 'https://drive.google.com/uc?export=download%26id=1W_iO69sYxXpxC5YlnCHcP-qh0KfNoMrv',
    flag: 'cohesion.ctf{P3rs1st3nce_1s_k3y}',
    pholder:'cohesion.ctf{}',
    category: 'Misc',
  },
  // {
  //   id: 19,
  //   title: 'Weird Sound',
  //   question: 'Recently the author got a message from his buddy but he thinks this is an encoded message can you decode it for him?',
  //   points: 100,
  //   author: '!nVoK3r',
  //   resource: 'https://drive.google.com/uc?export=download%26id=1fEd-JmqpRuYe6Xyi0A6yYfXsXWWUZsTL',
  //   flag: 'cohesion.ctf{DTMFTONESAREFUN}',
  //   pholder:'cohesion.ctf{}',
  //   category: 'Misc',
  // },
  // {
  //   id: 20,
  //   title: 'Dabbe Me Dabba',
  //   question: "Let's see how deep the rabbit hole goes... ;)",
  //   points: 50,
  //   author: 'mystog3n',
  //   resource: 'https://drive.google.com/uc?export=download%26id=1sS83A_If7kA_kzlYfIWc-8NpUFBBzdtG',
  //   flag: 'cohesion.ctf{y0u_mu5t_d1g_d33p-ieee}',
  //   category: 'Misc',
  // },
  // {
  //   id: 21,
  //   title: 'Discord',
  //   question: 'Join our discord server and find the flag. https://discord.gg/TUf6B6ANw3',
  //   points: 20,
  //   author: 'mystog3n',
  //   resource: null,
  //   flag: 'cohesion.ctf{TH4NK5-F0R-J01N1NG-D15C0RD}',
  //   category: 'Misc',
  // },
  // {
  //   id: 22,
  //   title: 'Lost in the Dimensions',
  //   question: '',
  //   points: 200,
  //   author: '',
  //   resource: 'https://drive.google.com/uc?export=download%26id=1PbZuztzFMHYBrs2vOOl3JxqxyyyADsQ9',
  //   flag: 'cohesion.ctf{H1DD3N_1N_D1M3N510N5}',
  //   category: 'Misc',
  // },
  // {
  //   id: 23,
  //   title: 'Basic Rev',
  //   question: "Let's see how good your basics are",
  //   points: 50,
  //   author: 'mystog3n',
  //   resource: 'https://drive.google.com/uc?export=download%26id=12YEf_z4bH1FohpMc9VDkqA3HOrfga4zL',
  //   flag: 'IEENCU.CTF{R3V3R53_15_N0T_H4RD_0000}',
  //   category: 'Rev',
  // },
  // {
  //   id: 24,
  //   title: 'Basic Rev 2',
  //   question: "Let's see how good your basics are, part 2.",
  //   points: 100,
  //   author: 'mystog3n',
  //   resource: 'https://drive.google.com/uc?export=download%26id=1NZU_ZFnNVMwlq05APODkUckPC6gR17B4',
  //   flag: 'IEEENCU.CTF{B451C-R3V3R53-3NG-4-FUN}',
  //   category: 'Rev',
  // },
  // {
  //   id: 25,
  //   title: 'Andy',
  //   question: 'Andy got a file named andy and Andy wants to open andy. Help Andy by using any means opening andy.',
  //   points: 150,
  //   author: 'mystog3n',
  //   resource: 'https://drive.google.com/uc?export=download%26id=1l_FEMYTZq0AOXWMYEf2strzHISPFcSkH',
  //   flag: 'IEEENCU.CTF{W0W_4NDR01D_H45_4PK!!}',
  //   category: 'Rev',
  // },
  // {
  //   id: 26,
  //   title: 'Pyro',
  //   question: '',
  //   points: 170,
  //   author: 'mystog3n',
  //   resource: 'https://drive.google.com/uc?export=download%26id=1JgpzgxfjTbLynOkZqz3JsjoMdyDBWreS',
  //   flag: 'IEEENCU.CTF{TH3_FUN_0F_R3VERS1NG-PYTH0N}',
  //   category: 'Rev',
  // },
  // {
  //   id: 27,
  //   title: 'Grep The Flag',
  //   question: '',
  //   points: 230,
  //   author: 'mystog3n',
  //   resource: 'https://drive.google.com/uc?export=download%26id=16Se949ch9Ft8_J30HSfPYf-xeiSLh_QH',
  //   flag: 'IEEENCU.CTF{GR3PP1NG_TH3_FL4G_15_H4RD_4F}',
  //   category: 'Rev',
  // },
  // {
  //   id: 28,
  //   title: 'Not So Basic',
  //   question: "After some basic rounds, let's see how you do in a not so basic challenge.",
  //   points: 270,
  //   author: 'mystog3n',
  //   resource: null,
  //   flag: 'IEEENCU.CTF{FUNCT10N5-4R3NT-FUN-4ND-345Y}',
  //   category: 'Rev',
  // },
  // {
  //   id: 29,
  //   title: 'Post Office',
  //   question: 'Ashley wants to send a letter to her friend. She needs to go to the post office for this. Can you help her send the letter?',
  //   points: 100,
  //   author: 'mystog3n',
  //   resource: 'https://ctf-post-office-t3ppmfifsq-as.a.run.app',
  //   flag: 'cohesion.ctf{W0RDPR355_H4CK1NG_U51NG_R0CKY0U}',
  //   category: 'Web',
  // },
  // {
  //   id: 30,
  //   title: 'Johnny With Tori',
  //   question: 'Johnny wants to impress Tori by finding the flag. However only the author has access to the REAL flag. Can you help Johnny find the flag?',
  //   points: 150,
  //   author: 'mystog3n',
  //   resource: 'https://ctf-jack-with-tori-t3ppmfifsq-as.a.run.app',
  //   flag: 'cohesion.ctf{JwT_t0k3N_t0_Th3_w1n}',
  //   category: 'Web',
  // },
  // {
  //   id: 31,
  //   title: 'Gamer Boy',
  //   question: "Do you like to play classic console games? Yes? That's awesome, so do I. Here check out this list of the games I've played. You  can also search for Games here.",
  //   points: 170,
  //   author: 'mystog3n',
  //   resource: 'https://ctf-gamer-boy-t3ppmfifsq-as.a.run.app',
  //   flag: 'cohesion.ctf{1nj3ct10n-4tt4ck_15-b35t}',
  //   category: 'Web',
  // },
  // {
  //   id: 32,
  //   title: 'Word in the Press',
  //   question: 'Alom has a friend Pooja. Pooja works in a press company and tells the latest happenings to Alom. With the information from Pooja, Alom writes blogs about latest happening. Go check it out.',
  //   points: 200,
  //   author: 'mystog3n',
  //   resource: 'https://ctf-word-in-the-press-t3ppmfifsq-as.a.run.app',
  //   flag: 'cohesion.ctf{Y0u_h4v3_G0T_m41l}',
  //   category: 'Web',
  // },
  // {
  //   id: 33,
  //   title: 'Jack Jill',
  //   question: "Jack and Jill went up the hill. But Jack's git commit-ment issues. Jack left Jill. But there was something hidden inside Jack. Can you find what it is?",
  //   points: 250,
  //   author: 'mystog3n',
  //   resource: 'https://ctf-jack-jill-t3ppmfifsq-as.a.run.app',
  //   flag: 'cohesion.ctf{git-c0mm1t1ng_t0_th3_c4u53}',
  //   category: 'Web',
  // },
];
