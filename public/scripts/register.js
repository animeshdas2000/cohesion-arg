function register () {
  var email = document.getElementById ('r_email').value;
  var password = document.getElementById ('r_password').value;
  var xmlHttpRequest = new XMLHttpRequest ();
  xmlHttpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        console.log ('Registeration successful');
      } else {
        console.log ('Error Occured');
      }
    }
  };
  xmlHttpRequest.open ('POST', '/users/signup', true);
  xmlHttpRequest.setRequestHeader ('Content-Type', 'application/json');
  xmlHttpRequest.send (JSON.stringify ({email: email, password: password}));
}
