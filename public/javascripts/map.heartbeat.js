$(document).ready(function() {
  

poll();
$.jheartbeat.set({
			url: "/map/quicky.json",
			delay: 5000
		}, function () {
			// Callback Function
			poll();
		});

});

function poll(){
  $.get(  "/map/heartbeat.json", 
          { lat: $.sirkel.lat, lng: $.sirkel.lng }, 
          function(result){ 
            //console.log('[' + parseInt(Math.random() * 10000) + ']' + ' Beating...'); 
            //console.log(result);
            updateProximeUsers();
            
          }, 
          'json')
}

	

