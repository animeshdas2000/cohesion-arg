const clickx= document.getElementById('pencet');

clickx.addEventListener('click', function(){
  clickx.classList.toggle('Diam');
 
});

function navopen(){
    var x= document.getElementById('navbar-id')
    x.classList.toggle('nav-links-visible')
}