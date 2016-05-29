// dedicated worker for chat

include('Chat_Worker_Videochat_functions.js','relative');


onmessage = function (event)
{
};

onconnect = function (event) { //Called each time a new client is connected
    var webSocket = event.ports[0]; //Access to the WebSocket client object. 
     // Undefined if shared worker is called from SSJS server.
    webSocket.binaryType = 'string'; // Defines the exchanged data type
        // this worker property is only available in the context of a WebSocket
    //webSocket.postMessage("helloWorld");
    
    webSocket.onmessage = function(message) { //Called each time a client sends a message
    	if (message.data) { // data received
	       var data = JSON.parse(message.data); 
	       var mutex_webSocket_onMessage = Mutex('mutex_webSocket_onMessage');
	       mutex_webSocket_onMessage.lock();
				switch (data.kind) {
				case 'open':
					ws_Users_add(data.user_ID, webSocket);
					ws_Broadcast_other_Online_Users(webSocket);
					break;
				case 'new_chatmessage':
					ws_new_chatessage(data.user_ID, data.receiver_Webuser_ID);
					break;
				case 'new_paymment_confirmation':
					ws_new_paymentConfirmation(data.user_ID, data.receiver_Webuser_ID);
					break;
				case 'new_PayPal_IPN_Notification':
					ws_new_PayPal_IPN_request(data.PayPal_request_body);
					break;
				case 'videochat_request_call':
					ws_videochat_request_call(data.user_ID, data.Webuser_ID_to_call);
					break;
				case 'videochat_request_terminate':
					ws_videochat_request_terminate(data.user_ID, data.Webuser_ID_to_call);
					break;
				case 'videochat_request_accept_call':
					ws_videochat_request_accept_call(data.user_ID, data.Webuser_ID_to_call);
					break;
				case 'videochat_request_decline_call':
					ws_videochat_request_decline_call(data.user_ID, data.Webuser_ID_to_call);
					break;
				case 'videochat_request_decline_due_to_hardware_error':
					ws_videochat_request_Decline_due_to_hardware_error(data.user_ID, data.Webuser_ID_to_call);
					break;
				case 'videochat_request_WebRTC_Offer':
					ws_videochat_request_WebRTC_Offer(data.user_ID, data.Webuser_ID_to_call, data.WebRTC_offer);
					break;
				case 'videochat_request_WebRTC_Answer':
					ws_videochat_request_WebRTC_Answer(data.user_ID,data.Webuser_ID_Caller, data.WebRTC_sessionDescription);
					break;
			}; // end switch
			mutex_webSocket_onMessage.unlock();
	   }; // end if data received
    };
    
    webSocket.onclose = function() {
    	ws_Users_remove(webSocket);
    	ws_Broadcast_other_Online_Users(webSocket);
    };
};

var ws_Users_arr = []; // array of connected users
var ws_Users_add = function (user_ID_to_add, ws_to_add) { // add user
	var index = -1;
	// override user id if it exists
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].User_ID === user_ID_to_add) { // Webuser in array of connected users
				index = i;
				break;
			}; //end if // Webuser in array of connected users
		}; // end if element not deleted
	}; // end for
			
	if (index === -1) index = ws_Users_arr.length;
	ws_Users_arr[index] = {};
	ws_Users_arr[index].User_ID = user_ID_to_add;
	ws_Users_arr[index].User_Name = '';
	var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', user_ID_to_add);
	if (Webuser_Entity) ws_Users_arr[index].User_Name  = Webuser_Entity.Name;
	ws_Users_arr[index].websocket = ws_to_add;
	ws_Users_arr[index].Videochat_Other_Webuser_ID = ''; // Videochat other Webuser ID
	ws_Users_arr[index].Videochat_Current_Status = 'none'; // Videochat current Status	
}; // end var ws_Users_add

// get arrayindex ws_Users_arr for Webuser_ID
var ws_Users_arr_get_Index_for_User_ID = function (Webuser_ID) {
	var index = -1;
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].User_ID === Webuser_ID) { // Webuser in array of connected users
				index = i;
				break;
			}; //end if Webuser in array of connected users
		}; // end if element not deleted
	}; // end for
	return index;
}; // end var ws_Users_arr_get_Index_for_User_ID

// get arrayindex ws_Users_arr for Websocket
var ws_Users_arr_get_Index_for_Websocket = function (Websocket) {
	var index = -1;
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].websocket === Websocket) { // Webuser in array of connected users
				index = i;
				break;
			}; //end if Webuser in array of connected users
		}; // end if element not deleted
	}; // end for
	return index;
}; // end var ws_Users_arr_get_Index_for_Websocket

var ws_Users_remove = function (websocket_to_remove) { // remove user
	var index = -1;
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].websocket === websocket_to_remove) { // Webuser in array of connected users
				index = i;
				break;
			}; //end if // Webuser in array of connected users
		}; // end if element not deleted
	}; // end for	
	if (index !== -1) delete(ws_Users_arr[index]);
}; // end var ws_Users_add

var ws_Broadcast_other_Online_Users = function (this_websocket) { // broad cast IDs of all other online webusers	
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].websocket !== this_websocket) { // do not broadcast to current user
				// send array of all other online webuser IDs
				var result = {};
				result.kind = 'Other_Online_Users';
				result.other_Online_Webuser_IDs = []; //array of all other online webusers
				
				for (var k = 0, k_len = ws_Users_arr.length; k < len; k++) {
					if (ws_Users_arr[k]) { // element not deleted
						if (k !== i) { // exclude user the message is send to (array of OTHER online user IDs
							result.other_Online_Webuser_IDs.push(ws_Users_arr[k].User_ID);
						}; // end if exclude user the message is send to (array of OTHER online user IDs
					}; // end if element not deleted
				}; // end for k

				ws_Users_arr[i].websocket.postMessage(JSON.stringify(result));
			}; //end if do not broadcast to current user
		}; // end if element not deleted
	}; // end for	
}; // end var ws_Broadcast_Online_Users

// send notification of new chat message to receiving user
var ws_new_chatessage = function (user_id_sender, user_id_receiver) {
	var index = -1;
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].User_ID === user_id_receiver) { // Webuser in array of connected users
				index = i;
				break;
			}; //end if // Webuser in array of connected users
		}; // end if element not deleted
	}; // end for
	
	if (index !== -1) { // user is registered
		var result = {};
		result.kind = 'new_chatmessage';
		result.Webuser_w_unread_Message_ID = user_id_sender;
		ws_Users_arr[index].websocket.postMessage(JSON.stringify(result));
	}; // end if user is registered
}; // end var ws_new_chatessage


// send notification of new confirmed payment to receiving user
var ws_new_paymentConfirmation = function (user_id_sender, user_id_receiver) {
	var index = -1;
	for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
		if (ws_Users_arr[i]) { // element not deleted
			if (ws_Users_arr[i].User_ID === user_id_receiver) { // Webuser in array of connected users
				index = i;
				break;
			}; //end if // Webuser in array of connected users
		}; // end if element not deleted
	}; // end for
	
	if (index !== -1) { // user is registered
		var result = {};
		result.kind = 'new_confirmed_payment';
		ws_Users_arr[index].websocket.postMessage(JSON.stringify(result));
	}; // end if user is registered
}; // end var ws_new_paymentConfirmation

// process verified IPN message
var process_IPN_Verified = function (request_body_from_PayPal) {
	include ('scripts/Utility_functions.js'); 
	var field_keys = URL_Value_Object_from_URL_Path(request_body_from_PayPal); // make object with key properties for values
	if (field_keys.custom) { // UUID in dataclass PayPalSubmission
		if (field_keys.mc_currency && field_keys.mc_currency === 'EUR' && field_keys.c_gross && field_keys.c_gross > 0) { // EUR and amount transmitted
			var PayPalSubmission_Entity = ds.PayPalSubmission.find('UUID == :1', field_keys.custom);
			if (PayPalSubmission_Entity) { // Entity with UUID exists
				if (!PayPalSubmission_Entity.Amount_EUR_Received) { // payment processed 1st time
					PayPalSubmission_Entity.Amount_EUR_Received = field_keys.c_gross;
					PayPalSubmission_Entity.Date_Time_Received = new Date();
					PayPalSubmission_Entity.save();
					
					// create new Credit_Transaction entity
					var Credit_Transaction_Entity = ds.Credit_Transaction.createEntity();
					Credit_Transaction_Entity.Kind = 'Payment';
					Credit_Transaction_Entity.Date_Time_Entered = PayPalSubmission_Entity.Date_Time_Send;
					Credit_Transaction_Entity.Webuser = PayPalSubmission_Entity.Webuser;
					Credit_Transaction_Entity.EUR = PayPalSubmission_Entity.Amount_EUR_Received;
					Credit_Transaction_Entity.Amount_of_Credits = Math.round(Credit_Transaction_Entity.EUR * 4);
					Credit_Transaction_Entity.Account = 'PayPal';
					Credit_Transaction_Entity.Date_Time_Payment_Received = PayPalSubmission_Entity.Date_Time_Received;
					Credit_Transaction_Entity.save();
					
					// send notification to receiver client via webworker
					var index = -1;
					for (var i = 0, len = ws_Users_arr.length; i < len; i++) {
						if (ws_Users_arr[i]) { // element not deleted
							if (ws_Users_arr[i].User_ID === Credit_Transaction_Entity.Webuser.Directory_ID) { // Webuser in array of connected users
								index = i;
								break;
							}; //end if // Webuser in array of connected users
						}; // end if element not deleted
					}; // end for					
					if (index !== -1) { // user is registered
						var result = {};
						result.kind = 'new_confirmed_payment';
						ws_Users_arr[index].websocket.postMessage(JSON.stringify(result));
					}; // end if user is registered		
				}; // payment processed 1st time
			}; // Entity with UUID exists
		}; // end if EUR and amount transmitted
	}; // UUID in dataclass PayPalSubmission transmitted
}; // end var process_IPN_Verified

// handle PayPal IPN request
var ws_new_PayPal_IPN_request = function (PayPal_request_body) {
	var PayPalReq = new XMLHttpRequest();
	var URL = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
	// read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
	PayPal_request_body = decodeURIComponent(PayPal_request_body);
	URL = URL + '?cmd=_notify-validate&' + PayPal_request_body;	
	URL = encodeURI(URL);	
	
	PayPalReq.open('Get',URL); // connect using the https protocol

    PayPalReq.onreadystatechange = function() {
		var state = this.readyState;
		var result, jsonText;
		var dataObj = {};
		if (state !== 4) { 
			return;
		}; // end if state !== 4
		
		result = this.responseText; 	    
	    if (result) { // looks like valid response
		   	if (result.substring(0, 8) === 'VERIFIED'){
		       process_IPN_Verified(PayPal_request_body); // process verified IPN message
			} // end if VERIFIED
			else { // not VERIFIED
				if (result.substring(0, 7) === 'INVALID') {
		    	}; // end if
			}; // end else
		}; // end looks like valid response
	}; // end PayPalReq.onreadystatechange
	
	PayPalReq.send();		
}; // end var ws_new_PayPal_IPN_request
