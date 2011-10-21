$(document).ready(function(){
  
  // Login via facebook...
  $("div#fb-login").bind('click', function(){
    window.location = 'auth/facebook';
  });
  
  // ...or twitter?
  $("div#twitter-login").bind('click', function(){
    //window.location = 'auth/twitter';
  });
  
  // Show/hide our vid.
  $('p.watch').bind('click', function(){
    $('.sirkel-tut').slideToggle();
    
    if( $(this).text() == 'New to Sirkel? Watch our getting started tutorial.'){
      $(this).html("<a href='#'>Done</a> watching the video?");
    }
    else if( $(this).text() == 'Done watching the video?' ){
      $(this).text('Login below.');
      $('p.watch').unbind();
    }
    
  });
  
  $('header p#contact').bind('click', function(){
    //$('html, body').animate({ scrollTop: $('#fb-login').offset().top }, 'slow');
    $("#contact-div").fadeIn(500).delay(5000).fadeOut(500)
  });
  
  $('header p#about').bind('click', function(){
    //$('html, body').animate({ scrollTop: $('#fb-login').offset().top }, 'slow');
    $("#about-div").fadeIn(500).delay(10000).fadeOut(500)
  });
  
});