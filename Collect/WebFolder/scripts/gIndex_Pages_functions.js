// functions generic for all index pages

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

// post form data using post
// copied from http://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
// modified: special case property name 'xreturn' -> 'return'
var post_form = function (path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    // form.setAttribute('target', '_blank'); // open in new window

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
        	if (key === 'xreturn') key = 'return'; // return is reserved word
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
};

// Enable/Disable WAF button
var WAF_Button_Able = function (id, enable) {
	enable ? $$(id).enable() : $$(id).disable(); // enable/disable button
}; // end var Videochat_Button_Videochat_Able
