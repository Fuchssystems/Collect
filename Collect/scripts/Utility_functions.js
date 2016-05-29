// utility function server side

// make object with key/values from an URL
// example input URL: key=value?language=en
// modified function from stackoverflow.com/questions/901115
// usage: for a passed Key=value&key2=value2 string (with leading '?')
// an object with values as propertie names will be returned
var URL_Value_Object_from_URL_Path = function(s) {
	var a = s.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
};


// distance between 2 coordinates (lattidude, longitude)
// copied from http://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong
var getDistanceFromLatLonInKm = function (lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

var deg2rad = function (deg) {
  return deg * (Math.PI/180);
};
