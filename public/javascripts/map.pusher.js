$(document).ready(function() {
  /*******
   Constants
   *********/
  $.sirkel = {};
  $.sirkel.activeChannels = {}
  


  //Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;
  Pusher.log = function(message) {
        if (window.console && window.console.log) window.console.log(message);
      };


  // Connect to Pusher.
  $.sirkel.pusher   = new Pusher('67b3874b87eccb84c688');
  
});



/********************************************************
 * CHANNEL & MESSAGE LOGIC.                                   
 ********************************************************/
 
 function getChannelByChatId(chatId){
   return $.sirkel.channels[chatId];
 }
 
 function addChannelAndBindByChatId(chatId){
   if( !$.sirkel.activeChannels[chatId] ){
      $.sirkel.activeChannels[chatId] = $.sirkel.pusher.subscribe(chatId);
      $.sirkel.activeChannels[chatId].bind('client-new-msg', function(data){
        // New message.
        newMessage(data.name, data.image_url, data.msg, data.chatId, data.lat, data.lng, 'Far!');
      });
    }
  }
 
 function removeChannelByChatId(chatId){
   $.sirkel.pusher.unsubscribe(chatId);
   delete $.sirkel.activeChannels[chatId];
 }
 
 /********************************************************
 * FUNCTION: newMessage()                                   
 ********************************************************/
 function newMessage(name, image_url, msg, chatId, latitude, longitude, distance){
   console.log('Chat id: ' + chatId + ' and active markers: ' + $.sirkel.activeMarkers);
   
   // Bring this chatBox to the top.
   $('#' + 'chatId').parent().css('z-index', $.sirkel.z + 1 );
   $.sirkel.z ++;
     
     if(!$.sirkel.activeMarkers[chatId]){
       var brandNew = true;
       console.log('Plotting a brand new marker b/c brand new message received.');
     }
     
    var shouldSlideOpen = true;
    addChatBoxAtLatLng( name, latitude, longitude, distance, chatId, image_url, shouldSlideOpen, brandNew);
   
   // Reposition the markers then pan to it.
   $.sirkel.activeMarkers[chatId].setPosition(new google.maps.LatLng(latitude, longitude));
   $.sirkel.map.panTo(new google.maps.LatLng(latitude, longitude));
   
   // Append msg.
   var chatContainer = getChatContainer(chatId);
   var imDiv = chatContainer.find('.im-roller').children('div:last');
   
   var isSelf = imDiv.attr('class') == 'im them wrap';
   (!isSelf) ? titleIt="<h2>THEM</h2>" : titleIt="";
   
   var msgHtml =   "<div class='im them wrap'>" + titleIt + 
                 "<p class='wrap'>" + msg + "</p></div>";
                 
   // If it's the first time, we need to buy ourselves some time before we can append. 
   // Essentially waiting for DOM el to become ready.
   if( brandNew){ setTimeout( function(){ getChatContainer(chatId).find('.im-roller').append(msgHtml);}, 1000) }
   else{ chatContainer.find('.im-roller').append(msgHtml); }
   
   showChatty(chatId);
   
   // If this chatbox isn't on page, we should slide it open.
   if($.sirkel.collapsed[chatId] || $.sirkel.openBoxes[chatId] == null){
     shouldSlideOpen = true;
     showChatbox(chatId, shouldSlideOpen);
   }
   
 }
 
 
 /********************************************************
 * FUNCTION: loginViaPusherPresenceUserChannel()                                   
 ********************************************************/
 function loginViaPusherPresenceUserChannel(){
   $.sirkel.channelPresenceUser = $.sirkel.pusher.subscribe('presence-user');

   // Bindings to channels.
   $.sirkel.channelPresenceUser.bind('update-users', function(data){
     // Do something here with the updated info.
     console.log(data);
   })

   $.sirkel.channelPresenceUser.bind('pusher_internal:member_removed', function(member) {
     // var chatId = formatIdString( $.sirkel.id, member.user_id);
     // 
     // if( $.sirkel.activeBoxes[chatId] ){
     //   removeChatboxByChatId(chatId);
     // }
   });

   // $.sirkel.channelPresenceUser.bind('pusher:subcription_succeeded', function(){
   //   locateAndGetProximeUsers();
   // });

   $.sirkel.channelPresenceUser.bind('pusher_internal:member_added', function(member){
       console.log("User added. Hooray!");
       //console.log(member);
       
       var chatId = formatIdString( $.sirkel.id, member.user_id);
       addChannelAndBindByChatId(chatId);
       updateProximeUsers();
   });
 }


