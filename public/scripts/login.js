function login () {
  firebase
    .auth ()
    .signInWithEmailAndPassword ($ ('#email').val (), $ ('#password').val ())
    .then (function (response) {
      document.cookie = 'uid=' + response.user.uid;
      $ ('#msg').text ('Login Successful!');
      window.location = '/';
    })
    .catch (function (error) {
      $ ('#msg').text (error.message);
    });
}

function resetPassword () {
  if (isEmail ($ ('#resetEmail').val ())) {
    firebase
      .auth ()
      .sendPasswordResetEmail ($ ('#resetEmail').val ())
      .then (function () {
        $ ('#reset-error').text (
          'An email containing the reset password link has been sent.'
        );
      })
      .catch (function (error) {
        $ ('#reset-error').text (error.message);
      });
    $ ('#resetEmail').val ('');
  } else $ ('#reset-error').text ('Please enter valid input!');
}

function isEmail (input) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test (input)) {
    return true;
  } else {
    return false;
  }
}

function isPassword (input) {
  var filter = /^(?=.*\d)(?=.*[A-Z]).{8,15}$/;
  if (filter.test (input)) {
    return true;
  } else {
    return false;
  }
}

$ (function () {
  $ ('#email').keyup (function () {
    if (!isEmail ($ ('#email').val ())) {
      $ ('#email_error').text ('Please enter a valid email address');
    } else {
      $ ('#email_error').text ('');
    }
  });

  $ ('#resetEmail').keyup (function () {
    if (!isEmail ($ ('#resetEmail').val ())) {
      $ ('#reset-error').text ('Please enter a valid email address');
    } else {
      $ ('#reset-error').text ('');
    }
  });

  $ ('#password').keyup (function () {
    if (!isPassword ($ ('#password').val ())) {
      $ ('#password_error').text (
        'Password should be 8-15 characters long with at least one numeric digit and one uppercase letter.'
      );
    } else {
      $ ('#password_error').text ('');
    }
  });

  $ ('#password').keyup (function (event) {
    if (event.keyCode === 13) {
      $ ('#login').click ();
    }
  });

  $ ('#login').click (function () {
    if (isEmail ($ ('#email').val ()) && isPassword ($ ('#password').val ())) {
      login ();
      $ ('#email').val ('');
      $ ('#password').val ('');
      $ ('#msg').text ('');
    } else $ ('#msg').text ('Please enter valid input!');
  });

  $ ('#forgotPass').click (function () {
    $ ('#resetPass').modal ('show');
  });
});
