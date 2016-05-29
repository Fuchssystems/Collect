// functions Dialog My Webcam

navigator.getUserMedia = navigator.getUserMedia ||
	                          navigator.webkitGetUserMedia ||
	                          navigator.mozGetUserMedia ||
	                          navigator.msGetUserMedia;

// Display Container My Webcam
var localMediaStream = null;

// get streaming status of media stream
var Media_Stream_get_isStreaming = function (stream) {
	var result = !!stream;
	return result;
};

// open local media stream
var localMedia_Stream_Open = function(navigator_getUserMedia_onSuccess, navigator_getUserMedia_onError) {	
	if (!Media_Stream_get_isStreaming(localMediaStream)) { // localMediaStream not streaming
		var errorCallback = null;
		if (navigator_getUserMedia_onError) { // no onError function defiend
			errorCallback = navigator_getUserMedia_onError;
		} // end if no onError function defined
		else { // onError function defined
			errorCallback = function (error) {
				alert('Error in localMedia_Stream_Open: ' + error);
			}; // end function errorCallback
		}; // end else onError function defined
		                          
		if (navigator.getUserMedia) { // browser supports getUserMedia
			var video = document.querySelector('#video_myCamera');
			navigator.getUserMedia({audio: true, video: {mandatory: {minWidth: 1280, minHeight: 720}}}, function(stream) {
				localMediaStream = stream;
		    	video.src = window.URL.createObjectURL(stream);
		    	navigator_getUserMedia_onSuccess(); // show myCamera container or continue with WebRTC
		  	}, errorCallback);	  
		} // end if browser supports getUserMedia
		else { // browser does not support getUserMedia
			alert(gStr_Localized_Get('Browser_does_not_support_Webcam', locObj_Main));
		};
	} // end if localMediaStream not streaming
	else { // localMediaStream already streaming
		navigator_getUserMedia_onSuccess();
	}; // end else localMediaStream already streaming
}; // end var localMedia_Stream_Open

// close local media stream
var localMedia_Stream_Stop =function () {
	if (Media_Stream_get_isStreaming(localMediaStream)) { // localMediaStream is streaming) {
		if (!localMediaStream.stop) { // Chrome Browser
			var tracks = localMediaStream.getTracks();
			for (var i = 0, len = tracks.length; i < len; i++) {
				tracks[i].stop();
			}; // end for
		} // end if Chrome Browser
		else { // not Chrome Browser
			localMediaStream.stop();
		}; // end else not Chrome Browser
		localMediaStream = null;;
	}; // end if localMediastream is streaming
}; // end var localMedia_Stream_Close


var myWebcam_Container_show = function (start_call_callback, onError_callback) { 
  	var navigator_getUserMedia_onSuccess = function () {
		$$(progPara.My_camera.Container_ID).show();
		if (start_call_callback) {
			start_call_callback();
		};
	}; // end var localMedia_Stream_onSuccess
	localMedia_Stream_Open (navigator_getUserMedia_onSuccess, onError_callback);
}; // end else browser does not support getUserMedia                        
	
// Close Dialog My Webcam
var myWebcam_Container_hide = function () {
	localMedia_Stream_Stop();
	$$(progPara.My_camera.Container_ID).hide();
}; // en var myWebcam_closeDialog
