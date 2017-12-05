// thanks https://stackoverflow.com/a/9996658/5203563

/* eslint-disable */

window.navigator.geolocation.getCurrentPosition = function(success){
  var position = {
    "coords" : {
      "latitude": "35.6895", 
      "longitude": "139.6917"
    }
  }; 
  success(position);
}
