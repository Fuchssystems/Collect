// Videochat functions component Chat and Profile

var videochat_speak = null; // object text to speak
if (typeof SpeechSynthesisUtterance === 'function') { // browser can speak
	videochat_speak = new SpeechSynthesisUtterance (); // Mesfge to speak object
}; // end if browser can speak

var videochat_current = {}; // current videochat status parameters
videochat_current.status = 'none'; // Vidoechat current status
videochat_current.other_Webuser_ID = ''; // other Webuser ID to call or calling
videochat_current.other_Webuser_Name = ''; // other Webuser Name to call or calling
videochat_current.peerjs_ID_this = null; // peerjs ID this peer
videochat_current.peerjs_ID_other = null; // peer js ID other peer

// Enable/Disable Videochat buttons
var Videochat_Button_Videochat_Able = function (enable) {
	for (var i = 0, len = Chat_Components.length; i < len; i++) {
		var id = Chat_Components[i].Component_id + '_button_Videochat_Open';
		enable ? $$(id).enable() : $$(id).disable(); // enable/disable button
	}; // end for
}; // end var Videochat_Button_Videochat_Able

// Check if Videochat Window is available
var Videochat_Window_is_available = function () {
	return videochat_current.status !== 'Videochat_Status_initializing'
			&& videochat_current.status !== 'videochat_status_calling'
			&& videochat_current.status !== 'videochat_status_incoming_call'
			&& videochat_current.status !== 'videochat_status_channel_open' 
			&& videochat_current.status !== 'videochat_status_WebRTC_Offer_received'
}; // end var Videochchat_Window_is_available

// Open Videochat window
var Videochat_Window_Open = function () {	
	$$('component_Main_container_Videochat').show();	
	$$('component_Main_richText_Videochat_Dialog_Title').setValue(gStr_Localized_Get('Videochat_Window_Title', locStr_Char,null,[videochat_current.other_Webuser_Name])); 
	Videochat_Button_Videochat_Able(false); // disable Videochat buttons in profile components
}; // end var Videochat_Window_Open

// call other Webuser main function
var Videochat_Call_Main = function (source_user_in_profile) {
	var Videochat_Call_Start = function (source_user_in_profile) {
		if (source_user_in_profile) { // called from Profile component: new User to call
			videochat_current.other_Webuser_ID = source_user_in_profile.Directory_ID;
			videochat_current.other_Webuser_Name = source_user_in_profile.Name;
		}; // end if called from Profile component: new User
		
		var OK_Flag = videochat_current.other_Webuser_ID && videochat_current.other_Webuser_Name;
		if (OK_Flag) {
			Videochat_Window_Open();
			
			videochat_current.status = 'initializing';
			$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get('Videochat_Status_initializing', locStr_Char));
			
			// Buttons in Videochat-Container Call, Terminate, Accept, Decline
			$$('component_Main_button_Videochat_Call').disable();
			$$('component_Main_button_Videochat_Call').show();
			$$('component_Main_button_Videochat_Terminate').enable();
			$$('component_Main_button_Videochat_Terminate').show();
			$$('component_Main_button_Videochat_Accept').disable();
			$$('component_Main_button_Videochat_Accept').hide();
			$$('component_Main_button_Videochat_Decline').disable();
			$$('component_Main_button_Videochat_Decline').hide();

			// create peer object
			var peer = new Peer({key: 'a58uyqxmtqp5vcxr'}); // key obtained by registering on peerjs.com
			peer.on('open', function (id) {
				// peerjs assigned a random id
				videochat_current.peerjs_ID_this = id;
				
				// send message to webworker
				var obj_to_send = {
					kind: 'videochat_request_call',
					user_ID: WAF_directory_currentUser,
					Webuser_ID_to_call: videochat_current.other_Webuser_ID,
					peer_ID: WebRTC_peer.videochat_current.peerjs_ID_this
				}; // end var obj_to_send
				ws.send(JSON.stringify(obj_to_send));
			}; // end peer.on
	
		}; // end if OK_Flag
	}; // end var Videochat_Call_Main
	
	if (!Media_Stream_get_isStreaming(localMediaStream)) { // localMediaStream not streaming
		myWebcam_Container_show(Videochat_Call_Start(source_user_in_profile));
	} // end if  localMediaStream not streaming
	else { // localMediaStream already streaming
		Videochat_Call_Start(source_user_in_profile);
	}; // end else localMediaStram already streaming	
}; // end var Videochat_Call_Main

// Accept incoming call main function
var Videochat_Accept_Call_Main = function () {
		// check localStream and open if not running
		var Videochat_Accept_Call_Accept = function () {
			if (videochat_current.status === 'videochat_status_incoming_call') { // not timed out during time to accept webcam use
				videochat_current.status = 'videochat_status_channel_open';
				$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get('videochat_status_channel_open', locStr_Char,null,[videochat_current.other_Webuser_Name]));

				$$('component_Main_button_Videochat_Call').disable();
				$$('component_Main_button_Videochat_Call').show();
				$$('component_Main_button_Videochat_Terminate').enable();
				$$('component_Main_button_Videochat_Terminate').show();
				$$('component_Main_button_Videochat_Accept').disable();
				$$('component_Main_button_Videochat_Accept').hide();
				$$('component_Main_button_Videochat_Decline').disable();
				$$('component_Main_button_Videochat_Decline').hide();
			
				// create peer object
				var peer = new Peer({key: 'a58uyqxmtqp5vcxr'}); // key obtained by registering on peerjs.com
				peer.on('open', function (id) {
					// peerjs assigned a random id
					videochat_current.peerjs_ID_this = id;
					
					// send message to webworker
					var obj_to_send = {
						kind: 'videochat_request_accept_call',
						user_ID: WAF_directory_currentUser,
						Webuser_ID_to_call: videochat_current.other_Webuser_ID,
						peer_ID: videochat_current.peerjs_ID_this
					}; // end var obj_to_send
					ws.send(JSON.stringify(obj_to_send));
				}; // end peer.on
			}; // end if not timed out during time to accept webcam use
		}; // end var Videochat_Accept_Call_Accept
	
	if (!Media_Stream_get_isStreaming(localMediaStream)) { // localMediaStream not streaming
		myWebcam_Container_show(Videochat_Accept_Call_Accept, Videochat_Hardware_Error_Cancel);
	} // end if  localMediaStream not streaming
	else { // localMediaStream already streaming
		Videochat_Accept_Call_Accept();
	}; // end else localMediaStram already streaming
}; // end var Videochat_Accept_Call_Main

// Cancel due to local hardware error
var Videochat_Hardware_Error_Cancel = function () {
	videochat_current.status = 'videochat_status_local_Webcam_Error';
	$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(videochat_current.status, locStr_Char,null,[videochat_current.other_Webuser_Name]));

	$$('component_Main_button_Videochat_Call').enable();
	$$('component_Main_button_Videochat_Call').show();
	$$('component_Main_button_Videochat_Terminate').disable();
	$$('component_Main_button_Videochat_Terminate').show();
	$$('component_Main_button_Videochat_Accept').disable();
	$$('component_Main_button_Videochat_Accept').hide();
	$$('component_Main_button_Videochat_Decline').disable();
	$$('component_Main_button_Videochat_Decline').hide();
	
	// send message to webworker
	var obj_to_send = {
		kind: 'videochat_request_decline_due_to_hardware_error',
		user_ID: WAF_directory_currentUser,
		Webuser_ID_to_call: videochat_current.other_Webuser_ID
	}; // end var obj_to_send
	ws.send(JSON.stringify(obj_to_send));
}; // end var Videochat_Hardware_Error_Cancel

// Decline incoming call
var Videochat_Decline_Call = function () {
	videochat_current.status = 'videochat_status_I_declined';
	$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(videochat_current.status, locStr_Char,null,[videochat_current.other_Webuser_Name]));

	$$('component_Main_button_Videochat_Call').enable();
	$$('component_Main_button_Videochat_Call').show();
	$$('component_Main_button_Videochat_Terminate').disable();
	$$('component_Main_button_Videochat_Terminate').show();
	$$('component_Main_button_Videochat_Accept').disable();
	$$('component_Main_button_Videochat_Accept').hide();
	$$('component_Main_button_Videochat_Decline').disable();
	$$('component_Main_button_Videochat_Decline').hide();
	
	// send message to webworker
	var obj_to_send = {
		kind: 'videochat_request_decline_call',
		user_ID: WAF_directory_currentUser,
		Webuser_ID_to_call: videochat_current.other_Webuser_ID
	}; // end var obj_to_send
	ws.send(JSON.stringify(obj_to_send));
}; // end var Videochat_Decline_Call

// Close Videochat window
var Videochat_Window_Close = function () {
	// send message to webworker
	var obj_to_send = {
		kind: 'videochat_request_terminate',
		user_ID: WAF_directory_currentUser,
		Webuser_ID_to_call: videochat_current.other_Webuser_ID
	}; // end var obj_to_send
	ws.send(JSON.stringify(obj_to_send));
	
	videochat_current.status = 'none';
	videochat_current.other_Webuser_ID = '';
	videochat_current.other_Webuser_Name = '';
	$$('component_Main_richtext_Videochat_Status').setValue('');
	$$('component_Main_container_Videochat').hide(); 
	Videochat_Button_Videochat_Able(true); // enable Videochat buttons in profile components
}; // end var Videochat_Window_Close

// Handler Videochat status received from Chatmodule
var ws_Videochat_Status_received = function (data_received) {
	if (videochat_current.other_Webuser_ID = data_received.Webuser_ID_other_Webuser) {  // called Webuser in message is same than in current called on client
		if (locStr_Char[app_Languages.default_shortcut][data_received.Status]) { // valid message string identifier
			switch (data_received.Status) {
				case ('videochat_status_calling'):
					videochat_current.status = data_received.Status;
					$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(data_received.Status, locStr_Char,null,[videochat_current.other_Webuser_Name]));
					break;
				case ('videochat_status_channel_open'):
					ws_videochat_status_channel_open(data_received);
					break;					
				case ('videochat_status_incoming_call'):
					ws_Videochat_Incoming_Call(data_received);
					break;
				case ('videochat_status_missed_call'):
					ws_VideoChat_Missed_Call(data_received);
					break;
				case ('videochat_status_caller_terminated'):
					ws_Videochat_other_Webuser_terminated(data_received);
					break;
				case ('videochat_status_WebRTC_Offer_received'):
					ws_Videochat_WebRTC_Offer_received(data_received);
					break;
				case ('videochat_status_Answer_to_Offer_received'):
					ws_Videochat_WebRTC_Answer_received(data_received);
					break;
				default: // all reasons connection could not be established	
					videochat_current.status = data_received.Status;
					$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(data_received.Status, locStr_Char,null,[videochat_current.other_Webuser_Name]));
					$$('component_Main_button_Videochat_Call').enable();	
					Videochat_Button_Videochat_Able(true); // enable Videochat buttons in profile components				
			}; // end switch
		}; // end if valid message string identifier
	}; // called Webuser in message is same than in current called on client	
}; // end var ws_Videochat_Status_received

// Handler incoming call
var ws_Videochat_Incoming_Call = function (data_received) {
	if (Videochat_Window_is_available()) { //  Videochat Window is not in use
		videochat_current.other_Webuser_ID = data_received.Webuser_ID_other_Webuser;
		videochat_current.other_Webuser_Name = data_received.Webuser_Name_other_Webuser;
		videochat_current.peerjs_ID_other = data_received.peer_ID_other_Webuser;
		alert('videochat_current.peerjs_ID_other: ' + videochat_current.peerjs_ID_other);
		Videochat_Window_Open();
			
		videochat_current.status = data_received.Status;
		$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(videochat_current.status, locStr_Char,null,[videochat_current.other_Webuser_Name]));
		
		// Buttons in Videochat-Container Call, Terminate, Accept, Decline
		$$('component_Main_button_Videochat_Call').disable();
		$$('component_Main_button_Videochat_Call').hide();
		$$('component_Main_button_Videochat_Terminate').disable();
		$$('component_Main_button_Videochat_Terminate').hide();
		$$('component_Main_button_Videochat_Accept').enable();
		$$('component_Main_button_Videochat_Accept').show();
		$$('component_Main_button_Videochat_Decline').enable();
		$$('component_Main_button_Videochat_Decline').show();
		
		if (videochat_speak) { // browser can speak
			videochat_speak.text = gStr_Localized_Get(videochat_current.status, locStr_Char,null,[videochat_current.other_Webuser_Name]);
			speechSynthesis.speak(videochat_speak);
		}; // end if browser can speak
	}; // end if Videochat Window is not in use
}; // end ws_Videochat_Incoming_Call

// Handler missed call
var ws_VideoChat_Missed_Call = function (data_received) {
	videochat_current.status = data_received.Status;
	var timestring = timestring_from_UTC_HH_MM(data_received.Time_Date);
	$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(videochat_current.status, locStr_Char,null,[data_received.Webuser_Name_other_Webuser,timestring]));

	// Buttons in Videochat-Container Call, Terminate, Accept, Decline
	$$('component_Main_button_Videochat_Call').enable();
	$$('component_Main_button_Videochat_Call').show();
	$$('component_Main_button_Videochat_Terminate').disable();
	$$('component_Main_button_Videochat_Terminate').show();
	$$('component_Main_button_Videochat_Accept').disable();
	$$('component_Main_button_Videochat_Accept').hide();
	$$('component_Main_button_Videochat_Decline').disable();
	$$('component_Main_button_Videochat_Decline').hide();
	
	Videochat_Button_Videochat_Able(true); // enable Videochat buttons in profile components
}; // end var ws_VideoChat_Missed_Call

// Handler other Webuser terminated
var ws_Videochat_other_Webuser_terminated = function (data_received) {
	videochat_current.status = data_received.Status;
	$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(videochat_current.status, locStr_Char,null,[videochat_current.other_Webuser_Name]));

	// Buttons in Videochat-Container Call, Terminate, Accept, Decline
	$$('component_Main_button_Videochat_Call').enable();
	$$('component_Main_button_Videochat_Call').show();
	$$('component_Main_button_Videochat_Terminate').disable();
	$$('component_Main_button_Videochat_Terminate').show();
	$$('component_Main_button_Videochat_Accept').disable();
	$$('component_Main_button_Videochat_Accept').hide();
	$$('component_Main_button_Videochat_Decline').disable();
	$$('component_Main_button_Videochat_Decline').hide();
	
	Videochat_Button_Videochat_Able(true); // enable Videochat buttons in profile components
}; // end var ws_Videochat_other_Webuser_terminated
	
// Handler other Webuser declined
ws_Videochat_other_Webuser_declined = function (data_received) {
	videochat_current.status = data_received.Status;
	$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(videochat_current.status, locStr_Char,null,[videochat_current.other_Webuser_Name]));

	// Buttons in Videochat-Container Call, Terminate, Accept, Decline
	$$('component_Main_button_Videochat_Call').enable();
	$$('component_Main_button_Videochat_Call').show();
	$$('component_Main_button_Videochat_Terminate').disable();
	$$('component_Main_button_Videochat_Terminate').show();
	$$('component_Main_button_Videochat_Accept').disable();
	$$('component_Main_button_Videochat_Accept').hide();
	$$('component_Main_button_Videochat_Decline').disable();
	$$('component_Main_button_Videochat_Decline').hide();
	
	Videochat_Button_Videochat_Able(true); // enable Videochat buttons in profile components
}; // end var ws_Videochat_other_Webuser_declined

// Handler Channel opened (received call accepted from called user)
var ws_videochat_status_channel_open = function (data_received) {
	videochat_current.status = data_received.Status;
	videochat_current.peerjs_ID_other = data_received.peer_ID_other_Webuser;
	alert('videochat_current.peerjs_ID_other: ' + videochat_current.peerjs_ID_other);
	$$('component_Main_richtext_Videochat_Status').setValue(gStr_Localized_Get(data_received.Status, locStr_Char,null,[videochat_current.other_Webuser_Name]));
	$$('component_Main_button_Videochat_Call').disable();

	// start WebRTC
	//WebRTC_Peer_Initialize();
}; // end var ws_videochat_status_channel_open



