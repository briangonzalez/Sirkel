/********************************************************
 * PREVENT IPAD PAGE SCROLL.                                    
 ********************************************************/
document.ontouchmove = function(e){
 e.preventDefault();
}

$(document).ready(function() {
  
  /********************************************************
   * CONSTANTS.                                    
   ********************************************************/
  $.sirkel.activeBoxes = {};   // Used to store/remove/delete chatboxes from page.
  $.sirkel.activeMarkers = {}; // Used to store/remove/delete markers from page.
  $.sirkel.openBoxes = {};
  $.sirkel.collapsed = {};
  $.sirkel.timeout = {};
  $.sirkel.z = 99;
  $.sirkel.markerSet = false;
  $.sirkel.image_url;
  $.sirkel.id;
  $.sirkel.chatContainer;
  $.sirkel.boxesToRevert = {};
  $.sirkel.loggedIn = false;  
  $.sirkel.chatContainer = $('.chat-container');
  
  
  // Set our interact event to either touch or click, based on hardware.
  if ( (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPhone") != -1)){
    $.sirkel.interactEvent = 'touchstart'; 
  }
  else{
    $.sirkel.interactEvent = 'click';
  }

           
  
  /********************************************************
   * INITIALIZE MAP.                                    
   ********************************************************/

    var myOptions = {
      zoom: 11,
      center: new google.maps.LatLng( 37.77, -122.42 ),   //$.sirkel.lat, $.$.sirkel.long), 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      panControl: false,
      zoomControl: false,
      scaleControl: true,
      scrollwheel: true,
      mapTypeControl: false,
      streetViewControl: false,
      disableDoubleClickZoom: true
    }
  
    // Init the map.
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    $.sirkel.map = map;
    
    // Function to allow us to drag & zoom using shift.
    map.enableKeyDragZoom({
              key: "alt",
              boxStyle: {
                border: "1px solid #f8b838",
                backgroundColor: "transparent",
                opacity: 1.0
              },
              veilStyle: {
                backgroundColor: "#333",
                opacity: 0.35,
                cursor: "crosshair"
              }
            });
    
    google.maps.event.addListener($.sirkel.map, 'mousemove idle', function() {
        $("a:contains('Terms of Use')").parent().fadeOut(50);
        $("img[src='http://maps.gstatic.com/intl/en_us/mapfiles/google_white.png']").fadeOut(50);
        $("div.gmnoprint").fadeOut(50);
        google.maps.event.clearListeners($.sirkel.map, 'mousemove');
    });
    
    google.maps.event.addListener($.sirkel.map, 'idle', function() {
      $("div.gmnoprint").css('left', 10);
    });
  
});



  /********************************************************
   * CHAT BOX LOGIC.                                    
   ********************************************************/

$(document).ready(function() {
  
  
  // Show chat contents when cursor is placed in box.
  $('.input-container input').focus(function(){
    $(this).parent().siblings('.slidy').show();
    
    var roller = $(this).parent().siblings('.slidy').children('.im-roller');
    roller.animate({ scrollTop: roller.attr("scrollHeight") }, 250);
    
    chatId = $(this).parents('.chat-container').attr('id');
    $.sirkel.collapsed[chatId] = false;
  });
  
  // Collapse chat contents when 'x' is clicked.
  $('.slidy .close').bind( $.sirkel.interactEvent, function(){   
    var chatContainer = $(this).parents('.chat-container');
    var chatId = chatContainer.attr('id');
    hideChatty(chatId);
  });
  
  $('.pointy-icon').bind( $.sirkel.interactEvent, function(){
    var chatContainer = $(this).parents('.chat-container');
    var chatId = chatContainer.attr('id');
    showChatty(chatId);
  });
  
  
  // Send button bindings.
  $('.send-button').mouseup(function(ev){
    $(this).css({background: 'url(/images/chat_send.png)'});
  });
  
  $('input').bind('keyup', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13){
      $(this).siblings('.send-button').css({background: 'url(/images/chat_send.png)'});
    }
  });
  
  
  // Bring the hover box to the forefront / set it to the back on leave.
  $(".chat-container").bind( $.sirkel.interactEvent + ' mouseover ' , function(){
    $(this).parent().css('z-index', $.sirkel.z + 1 );
    $.sirkel.z ++;
    $.sirkel.map.setOptions({scrollwheel: false});
  });
  
  $(".chat-container").bind( "mouseleave", function(){
    $.sirkel.map.setOptions({scrollwheel: true});
  });
  
  
  // Zoom buttons.
  $('.zoom-in').bind( $.sirkel.interactEvent, function(){
    var map = $.sirkel.map;
    map.setZoom( map.getZoom() + 1 );
  });
  
  $('.zoom-out').bind( $.sirkel.interactEvent, function(){
    var map = $.sirkel.map;
    map.setZoom( map.getZoom() - 1 );
  });
  
    
  // Send all button back from whence they came.
  $('#revert-button').bind( $.sirkel.interactEvent,function(){
    if(!$.isEmptyObject($.sirkel.boxesToRevert)){
      
      for(var i in $.sirkel.boxesToRevert) {
      	var data = $.sirkel.boxesToRevert[i];
      	data.marker.setPosition(data.latLng);
      }
      
      $(this).css({ background: "no-repeat url('/images/revert_button_inactive.png')" });
      $.sirkel.boxesToRevert = {};
      
    }
  });
  
  
  // Show & hide the status.
  $('p.hide').bind( $.sirkel.interactEvent, function(){
    $('#logged-inout').animate({top: '-1000px'}, function(){
      $('p.show').show();
    });   
  });
  
  $('p.show').bind( 'mouseover touchstart', function(){
    $('p.show').hide();
    $('#logged-inout').animate({top: '10px'});  
  });
  
  
  // The new user alert.
  $('#new-user-alert').animate({'left': '10px'});
  $('#close-new-user-alert').bind($.sirkel.interactEvent, function(){
    $('#new-user-alert').fadeOut(1000);
  });
  
  
});




  /********************************************************
   * AJAXXY FUNCTION CALLS.                                    
   ********************************************************/
 
$(document).ready(function() {

  
  /********************************************************
   * THE SLIDING LOGIC.                                    
   ********************************************************/
  $( "#slider" ).slider({
  			orientation: "vertical",
  			range: "min",
  			min: 0,
  			max: 3500,
  			value: 3,
  			disabled: true,
  			slide: function( event, ui ) {
  			  if(ui.value > 3000){
  			    $( "h1.sirkel" ).text( ui.value ).css({'color': 'red'});
  			  }
  			  else{
  			    $( "h1.sirkel" ).text( ui.value ).css({'color': '#ffd842'});;
  			  }
  				
  				$.sirkel.radius.setRadius( 1609 * ui.value);
  			}
  		});
  
  $( "#slider" ).bind( "slidechange", function(){

    updateProximeUsers();

  });
  
  
  
  
  
  /*******************
   * SEND SOME MESSAGES!!                                 
   ********************/
  $('.send-button').bind('mousedown touchstart', function(ev){
    $(this).css({background: 'url(/images/chat_send_pressed.png)'});
    
    if(ev.handleObj.type == 'touchstart'){
      $(this).css({background: 'url(/images/chat_send.png)'});
    }
    
    sendMsgViaPusher(this);
        
  });
  
  $('input').bind('keypress', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    
    if(code == 13){
      $(this).siblings('.send-button').css({background: 'url(/images/chat_send_pressed.png)'});
      el = $(this).siblings('.send-button');
      sendMsgViaPusher(el);
    }    
  });
  
}); 
