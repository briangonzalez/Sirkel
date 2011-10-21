// var myLoc = new Array();
// 
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
// } else {
//     console.log( 'It seems like Geolocation, which is required for this page,' + 
//                         'is not enabled in your browser. Please use a browser which supports it.');
// }
// 
// function successFunction(position) {
//     myLat    = position.coords.latitude;
//     myLong   = position.coords.longitude;
//     
//     myLoc.push(myLat);
//     myLoc.push(myLong);
//     
//     window.myLoc = myLoc;
// }
//     
// function errorFunction(position) {
//     alert('Error!');
// }