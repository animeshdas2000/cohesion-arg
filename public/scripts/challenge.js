function submitARGAnswer () {
  $.ajax ({
    url: '/arg/submit',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify ({
      answer: $ ('#answer').val ().toUpperCase (),
    }),
    success: function (data) {
      location.reload ();
      toastr.options = {
        newestOnTop: true,
        positionClass: 'toast-bottom-center',
        preventDuplicates: true,
        onclick: null,
        showDuration: 1000,
        hideDuration: 2000,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
      };
      toastr.info ('Correct... Level Up!');
    },
    error: function (jqXhr, textStatus, errorMessage) {
      toastr.options = {
        newestOnTop: true,
        positionClass: 'toast-bottom-center',
        preventDuplicates: true,
        onclick: null,
        showDuration: 1000,
        hideDuration: 2000,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
      };
      toastr.error ('Incorrect... Try Again!');
    },
  });
}

$ (function () {
  $ ('#answer').keyup (function (event) {
    if (event.keyCode === 13) {
      $ ('#submitARG').click ();
    }
  });

  $ ('#submitARG').click (function () {
    if ($ ('#answer').val ().length >= 1) {
      submitARGAnswer ();
      $ ('#answer_error').text ('');
    } else $ ('#answer_error').text ('Answer cannot be blank!');
  });

  $ ('#submitARG9').click (function () {
    if ($ ('#answer').val ().length >= 1) {
      toastr.options = {
        newestOnTop: true,
        positionClass: 'toast-bottom-center',
        preventDuplicates: true,
        onclick: null,
        showDuration: 1000,
        hideDuration: 2000,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
      };
      toastr.error ('Incorrect... Try Again!');
    } else $ ('#answer_error').text ('Answer cannot be blank!');
  });
});
