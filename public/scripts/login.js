function login () {
  $.ajax ({
    url: '/users/login',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify ({
      email: $ ('#email').val (),
      password: $ ('#password').val (),
    }),
    success: function (data) {
      $ ('#msg').text (data.msg);
      location.href = '/';
    },
    error: function (jqXhr, textStatus, errorMessage) {
      $ ('#msg').text (jqXhr.responseJSON.msg);
    },
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

function readCookie (name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split (';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt (0) == ' ')
      c = c.substring (1, c.length);
    if (c.indexOf (nameEQ) == 0) return c.substring (nameEQ.length, c.length);
  }
  return null;
}

$ (function () {
  $ ('#email').keyup (function () {
    if (!isEmail ($ ('#email').val ())) {
      $ ('#email_error').text ('Please enter a valid email address');
    } else {
      $ ('#email_error').text ('');
    }
  });

  if (readCookie ('uid') != null) location.href = '/';

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
