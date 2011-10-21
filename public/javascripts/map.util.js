/********************************************************
* FUNCTION: addChatBoxAtLatLng()                                    
********************************************************/
  function addChatBoxAtLatLng( name, latitude, longitude, distance, chatId, pUserImg, shouldSlideOpen, brandNew){   
   
   // Only add this chatbox IF it hasn't already been added.
   if(!$.sirkel.activeBoxes[chatId]){
     console.log('Creating chatbox...');
     
     // Place a marker for this chat box.
     var latLng = new google.maps.LatLng(latitude, longitude);
     var marker = new google.maps.Marker({
      			map: $.sirkel.map,
      			position: latLng,
      			visible: true,
            flat: true,
            draggable: true,
            icon: new google.maps.MarkerImage('/images/marker_drag.png'), 
    	});
				
    	// Grab a copy of our chat box.
    	var boxText = $.sirkel.chatContainer.clone( true, true );
    	boxText.css({display:'inherit'})
  	  	
    	// Replace user name, img and format our chatId, which will be used later via Pusher to insert new message.
    	boxText.attr('id', chatId);
    	boxText.find('.icon').css('background', 'url("' + pUserImg + '")' );
    	boxText.find('h1#slidy-name').text(name);
    	boxText.find('li#latstat').text(parseInt(latitude));
    	boxText.find('li#longstat').text(parseInt(longitude));
    	boxText.find('li#diststat').text('~' + parseInt(distance) + ' mi.');

	    
    	// Options for each chat box.
    	var myOptions = {
    		 closeBoxURL: "",
    		 content: boxText[0],
    		 disableAutoPan: false,
    		 maxWidth: 0,
    		 pixelOffset: new google.maps.Size(-140, -40),
    		 zIndex: null,
    		 boxStyle: { 
    		   width: "300px",
    		   overflow: 'visible'
    		 },
    		 infoBoxClearance: new google.maps.Size(1, 1),
    		 isHidden: false,
    		 pane: "floatPane",
    		 enableEventPropagation: false,
    	};

    	// Open the chat box at this marker.
    	var ib = new InfoBox(myOptions);
    	ib.open($.sirkel.map, marker);
    	
    	// Pan to this marker if it isn't visible.
      if( $.sirkel.openBoxes[chatId] == false ){ 
        $.sirkel.map.panTo(new google.maps.LatLng(latitude, longitude)); 
        }
      
      // If brand new message.
      if(brandNew){
        setTimeout(function(){
         showChatbox(chatId, shouldSlideOpen);
         addNewMessageClass(chatId);
        }, 500)
        
        // Bring this chatBox to the top.
        $('#' + 'chatId').parent().css('z-index', $.sirkel.z + 1 );
        $.sirkel.z ++;
      }
    	
    	// Here we can store markers linked to chatBoxes which we can destroy later.
    	$.sirkel.activeBoxes[chatId] = ib;
    	$.sirkel.activeMarkers[chatId] = marker;
    	$.sirkel.openBoxes[chatId] = true;
    	$.sirkel.collapsed[chatId] = true;
    	
  	
    	// EVENT: Open the chatbox upon user click.
    	google.maps.event.addListener( marker, "click", function (e) {
    		ib.open($.sirkel.map, this);
    	});
      
      google.maps.event.addListener( marker, "dragend", function (e) {                     
        if($.isEmptyObject($.sirkel.boxesToRevert)){ 
          $('#revert-button').css({ background: "no-repeat url('/images/revert_button.png')" });
          }
        
        oldLatLng = latLng;
        if(!$.sirkel.boxesToRevert[chatId]){
          $.sirkel.boxesToRevert[chatId] = { marker:marker, latLng: oldLatLng }; // We'll clear this array when all boxes get repositioned.
        }
      });
      
      // EVENT: Highlight the draggy icon.
      google.maps.event.addListener( marker, "mouseover", function (e) {
       marker.setIcon( new google.maps.MarkerImage('/images/marker_drag_hover.png') )
       marker.setFlat(false);
      });
      
      google.maps.event.addListener( marker, "mouseout", function (e) {
       marker.setIcon( new google.maps.MarkerImage('/images/marker_drag.png'));
       marker.setFlat(true);
       
      });
    	
  	}
  	
  	else{
  	  addNewMessageClass(chatId);
  	  console.log('Showing....' + chatId);  	  
  	  if( !$.sirkel.openBoxes[chatId]){
  	    showChatbox(chatId, shouldSlideOpen);
	    }
	    // Bring this chatBox to the top.
      $('#' + 'chatId').parent().css('z-index', $.sirkel.z + 1 );
      $.sirkel.z ++;  	
  	}
  }
  
  /********************************************************
  * FUNCTION: formatIdString()       
  ********************************************************/
    function formatIdString( id1, id2 ){   
      if ( id1 <= id2 ){
        return 'sirkel-' + id1 + '-' + id2;
      }
      else{
        return 'sirkel-' + id2 + '-' + id1;
      }
    }
  

/*****************************************************************************************************************************/



  /********************************************************
  * Chatbox related utility functions.                               
  ********************************************************/
  function removeChatboxByChatId(chatId){
    console.log("Hiding... " + chatId);
    hideChatty(chatId);
    $.sirkel.activeBoxes[chatId].hide();
    $.sirkel.openBoxes[chatId] = false;
    $.sirkel.activeMarkers[chatId].setVisible(false);
    //getChatContainer(chatId).removeClass('new-message');
  }
  
  function collapseChatbox(chatId){
    hideChatty(chatId);
  }
  
  function showChatbox(chatId, shouldSlideOpen){
    
    $.sirkel.activeBoxes[chatId].show();
    $.sirkel.openBoxes[chatId] = true;
    $.sirkel.activeMarkers[chatId].setVisible(true);
    
    console.log('New ?: ' + shouldSlideOpen);
    
    if(shouldSlideOpen){
      showChatty(chatId);
    } 
  }
  
  function showChatty(chatId){
    chatContainer = getChatContainer(chatId);
    
    chatContainer.find('.pointy-icon').fadeOut(100, function(){
      chatContainer.find('.input-container').fadeIn(100, function(){
        chatContainer.find('.input').focus();
        
        roller = chatContainer.find('.im-roller');
        roller.animate({ scrollTop: roller.attr("scrollHeight") }, 250);
        
        $.sirkel.collapsed[chatId] = false;
      });
    });
  }
  
  function hideChatty(chatId){
    chatContainer = getChatContainer(chatId);
    
    chatContainer.find('.slidy').fadeOut(100, function(){
      chatContainer.find('.input-container').fadeOut(100);
      chatContainer.find('.pointy-icon').fadeIn(100);
      $.sirkel.collapsed[chatId] = true;
    });
  }
  
  function getChatContainer(chatId){
    chatContainer = $( '#' + chatId  );
    return chatContainer;
  }
  
  function addNewMessageClass(chatId){
    var chatContainer = getChatContainer(chatId);
    chatContainer.addClass('new-message');
    if($.sirkel.timeout[chatId]){ clearTimeout($.sirkel.timeout[chatId]); }
    $.sirkel.timeout[chatId] = setTimeout( "chatContainer.removeClass('new-message')", 15000 ); // Let this new msg live for 15 sec.
  }
  
  
  
  
  /********************************************************
   * FUNCTION: addSirkel() <- Google map radius.                                    
   ********************************************************/
     function addSirkel( lat, lng ){
       // Add a Circle overlay to the map.
       var radius = new google.maps.Circle({
         center: new google.maps.LatLng(lat, lng),
         radius: 1609 * 3,
         fillColor: "#257bfa",
         fillOpacity: 0.2,
         strokeColor: "#257bfa",
         strokeWeight: 0,
         zIndex: 0,
       });
     
      $.sirkel.radius = radius;
      radius.setMap( $.sirkel.map );
      
    }
  
  
  
  
  
  /********************************************************
   * FUNCTION: updateProximeUsers()                                 
   ********************************************************/
  function updateProximeUsers(){
    
    $.sirkel.radiusVal  = $('div.radius-size h1').text();
    
    $.post(
      "/geolocate/locate_update_get.json", 
        { lat:    $.sirkel.lat, 
          lng:    $.sirkel.lng,
          radius: $.sirkel.radiusVal }, 
          
      function(response){ 
        // Set our name/id/image_url which we'll need when we send messages to clients whose Sirkel we're not in.
        $.sirkel.image_url  = response.image_url;
        $.sirkel.name       = response.name;
        $.sirkel.id         = response.self_id;
        
        // Add & remove proxime users.
        var proximeUsers = response.proxime_users;
        var allChatIds = response.all_chat_ids;
        var selfId = response.self_id;
        
                
        // Remove those outside Sirkel. ******************
        for (var chatId in $.sirkel.activeBoxes) {
          var classes = getChatContainer(chatId).attr('class');
          if( $.inArray(chatId, response.chat_ids) == -1 && !(classes == 'chat-container new-message')){  
            console.log('The classes we found: ' + classes);
            console.log( 'Chat at ' + chatId.toString() + ' should get deleted. The response was: ' + response.chat_ids.toString()  )
            removeChatboxByChatId(chatId);
          }
          else{
            console.log('No chats to delete.');
          }
        }
        
        // Add those who should be inside Sirkel. ****************
        for ( var i=proximeUsers.length-1; i>=0; --i ){
          var pUser = proximeUsers[i].user;
          
          // Only add box if it isn't already present on the map.
          var chatId = formatIdString( pUser.id, selfId );
          
          addChatBoxAtLatLng( pUser.name, pUser.latitude, pUser.longitude, pUser.distance, chatId, pUser.image_url);
          addChannelAndBindByChatId(chatId);
        }
        
        
        // Bind a channel to all users *****************************
        for ( var i=allChatIds.length-1; i>=0; --i ){
          //console.log('Creating connection with user ' + allChatIds[i]);
          addChannelAndBindByChatId(allChatIds[i]);
        }
        
      });
    
  }
  
  
  
  
  
  /********************************************************
   * FUNCTION: sendMsgViaPusher()                                    
   ********************************************************/
   function sendMsgViaPusher(el){
     var msg = $(el).siblings(':input').val()
     
     if(msg.length > 0){
      // Send the message by grabbing the chat box's id.
      var chatId = $(el).parents().find('.chat-container').attr('id');

      // Clear the input box.
      $(el).siblings(':input').val('');
    
      // Send the message over via Pusher.
      $.sirkel.activeChannels[chatId].trigger(  "client-new-msg", 
                                                { name:       $.sirkel.name,
                                                  image_url:  $.sirkel.image_url, 
                                                  msg :       msg,
                                                  chatId:     chatId,
                                                  lat:        $.sirkel.lat,
                                                  lng:        $.sirkel.lng  });
    
      // Add the message to the chat box.
      var imDiv = $(el).parent().siblings('.slidy').children('.im-roller').children('div:last');
      var isSelf = imDiv.attr('class') == 'im me wrap';
      
      (!isSelf) ? titleIt="<h2>YOU</h2>" : titleIt="";
      
      var msgHtml =   "<div class='im me wrap'>" + titleIt +
                    "<p class='wrap'>" + msg + "</p></div>";
                    
      
      $(el).parent().siblings('.slidy').children('.im-roller').append(msgHtml);
    
      showChatty(chatId);
    }
  }
  
  
  
  
  
  
  
  
  
  
  /*************************************
   * LOCATE USER AND GET PROXIME USERS                                   
   *************************************/
  $(function(){
    
    // This will find & pan to the user when the page loads.
     if (navigator.geolocation) {
       navigator.geolocation.watchPosition(  onLocateSuccess, onLocateError, 
                                             { enableHighAccuracy:true, maximumAge:30000, timeout: 120000} );
     } 
     else {
       alert(  'It seems like HTML5 Geolocation, which is required for SirkelApp,' + 
               'is not enabled in your browser. Please use a browser (like Google Chrome) which supports it.');
     }
  });
   
   function onLocateSuccess(position) {
     $('.radius-size').fadeIn(500);
     $('#slider').slider('enable');
     $('#locate-button').css('background', 'url(/images/locator_button.gif)')

     $.sirkel.lat        = parseFloat(position.coords.latitude);
     $.sirkel.lng        = parseFloat(position.coords.longitude);
     
     // Tell the rest of the world we've logged in and are being tracked.
     if(!$.sirkel.loggedIn){ loginViaPusherPresenceUserChannel(); $.sirkel.loggedIn = true; }
     
     // Add & pan to you.
     if (!$.sirkel.radius){ addSirkel($.sirkel.lat, $.sirkel.lng); }
     else{ $.sirkel.radius.setCenter( new google.maps.LatLng($.sirkel.lat, $.sirkel.lng) ) }

     if( $.sirkel.marker ){ $.sirkel.marker.setPosition( new google.maps.LatLng($.sirkel.lat, $.sirkel.lng) ) }
     else{             
       var marker = new google.maps.Marker({
         	map: $.sirkel.map,
         	position: new google.maps.LatLng($.sirkel.lat, $.sirkel.lng),
         	icon: "/images/locator.png",
         	optimized: false
       	}); 	
       	
       $.sirkel.marker = marker;
       $.sirkel.map.panTo(new google.maps.LatLng($.sirkel.lat, $.sirkel.lng)); //Pan to the first time.
       
     }

     updateProximeUsers();
     
   }

   
   function onLocateError(position) {
       console.log('[Error] Cant find location.')
       //window.location.replace("/?geo_error=true");
   }
