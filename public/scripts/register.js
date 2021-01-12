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

function isContact (input) {
  var filter = /^\d{10}$/;
  if (filter.test (input)) {
    return true;
  } else {
    return false;
  }
}

function register () {
  $.ajax ({
    url: '/users/signup',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify ({
      name: $ ('#name').val (),
      institution: $ ('#instname').val (),
      contact: $ ('#contact').val (),
      email: $ ('#email').val (),
      password: $ ('#password').val (),
      dob: $ ('#dob').val (),
    }),
    success: function (data) {
      $ ('#msg').text (data.msg);
      window.location = '/registrationsuccess';
    },
    error: function (jqXhr, textStatus, errorMessage) {
      $ ('#msg').text (jqXhr.responseJSON.msg);
    },
  });
}

$ (function () {
  $ ('#name').keyup (function () {
    if ($ ('#name').val ().length < 4) {
      $ ('#name_error').text ('Please enter at least 4 characters.');
    } else {
      $ ('#name_error').text ('');
    }
  });

  $ ('#instname').keyup (function () {
    if ($ ('#instname').val ().length < 4) {
      $ ('#instname_error').text ('Please enter at least 4 characters.');
    } else {
      $ ('#instname_error').text ('');
    }
  });

  $ ('#contact').keyup (function () {
    if (!isContact ($ ('#contact').val ())) {
      $ ('#contact_error').text ('Please enter a 10 digit contact number.');
    } else {
      $ ('#contact_error').text ('');
    }
  });

  $ ('#email').keyup (function () {
    if (!isEmail ($ ('#email').val ())) {
      $ ('#email_error').text ('Please enter a valid email address');
    } else {
      $ ('#email_error').text ('');
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

  $ ('#register').click (function () {
    if (
      $ ('#name').val ().length > 4 &&
      $ ('#instname').val ().length > 4 &&
      Date.parse ($ ('#dob').val ()) > 1 &&
      isEmail ($ ('#email').val ()) &&
      isPassword ($ ('#password').val ()) &&
      isContact ($ ('#contact').val ())
    ) {
      $ ('#msg').text ('');
      register ();
    } else $ ('#msg').text ('Please enter valid input!');
  });
});
