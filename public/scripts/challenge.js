function submitARGAnswer () {
  $.ajax ({
    url: '/arg/submit',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify ({
      answer: $ ('#answer').val ().toUpperCase(),
    }),
    success: function (data) {
      location.reload();
      // if (data.level == 19) location.reload();
      // $ ('#level').text (data.level);
      // $ ('#question').text (data.question);
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
  $ ('#submitARG').click (function () {
    if ($ ('#answer').val ().length >= 1) {
      console.log ($ ('#answer').val ().toUpperCase());
      submitARGAnswer ();
      $ ('#answer').val ('');
      $ ('#answer_error').text ('');
    } else $ ('#answer_error').text ('Answer cannot be blank!');
  });
});
