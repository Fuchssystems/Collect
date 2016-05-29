// Videochat function Webworker Chat_Worker

// Videochat request call other Webuser
 var ws_videochat_request_call = function (current_user_ID, Webuser_ID_to_call) {
	var index_ws_Users_arr_current_User =ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
 	if (index_ws_Users_arr_current_User !== -1) { // current user in array registered websockets
		var Status_to_return = ''; // Status to return to Client
	 	var OK_Flag = false;
	 	var result = {};
	 	
	 	// Check Online Status
	 	var index_ws_Users_arr_User_to_call = ws_Users_arr_get_Index_for_User_ID(Webuser_ID_to_call); // index other Webuer in array ws_Users_arr
	 	OK_Flag = index_ws_Users_arr_User_to_call !== -1;
	 	if (!OK_Flag) Status_to_return = 'videochat_status_Called_User_not_online';
	 	
	 	// Check caller exists
	 	if (OK_Flag) {
	 		var Webuser_to_call_Entity = ds.Webuser.find('Directory_ID == :1', Webuser_ID_to_call);
	 		OK_Flag = !! Webuser_to_call_Entity;
	 		if (!OK_Flag) Status_to_return = 'videochat_status_Called_User_does_not_exist_or_Profile_deactivated';
	 	}; // end if OK_Flag

	 	 // Check for Profile not deactivated
	 	if (OK_Flag) {
	 		OK_Flag = !Webuser_to_call_Entity.Profile_Deactivated;
	 		if (!OK_Flag) Status_to_return = 'videochat_status_Called_User_does_not_exist_or_Profile_deactivated';
	 	}; // end if OK_Flag
	 	
	 	 // Check for Videochat activated
	 	if (OK_Flag) {
	 		OK_Flag = Webuser_to_call_Entity.Videochat_Activated;
	 		if (!OK_Flag) Status_to_return = 'videochat_status_Called_User_has_not_activated_Videochat';
	 	}; // end if OK_Flag
	 	
	 	// Check for Webuser to call not occupied
	 	if (OK_Flag) {
	 		OK_Flag = ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Current_Status === 'none';
	 		if (!OK_Flag) Status_to_return = 'videochat_status_Called_User_occupied';
	 	}; // end if OK_Flag
	 	
	 	// Start calling
	 	if (OK_Flag) {
	 		Status_to_return = 'videochat_status_calling';
 			ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Other_Webuser_ID = Webuser_ID_to_call; // Videochat other Webuser ID
			ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = Status_to_return; // Videochat current Status
			ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID = current_user_ID.ID; // Other User Videochat this Webuser ID
			ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Current_Status = 'videochat_status_incoming_call'; // Other User Videochat current Status
			
			// send incoming call status to called Webuser
			result = {};
			result.kind = 'Videochat_Status';
			result.Status = 'videochat_status_incoming_call';			
			result.Webuser_ID_other_Webuser = current_user_ID.ID;;
			result.Webuser_Name_other_Webuser = ws_Users_arr[index_ws_Users_arr_current_User].User_Name;
			result.Time_Date = new (Date);

			ws_Users_arr[index_ws_Users_arr_User_to_call].websocket.postMessage(JSON.stringify(result));
			
			// set timeout function to check for unanswered call
		 	var para_obj = {}; // parameter object for setTimeOut function
		 	para_obj.index_ws_Users_arr_current_User = index_ws_Users_arr_current_User;
		 	para_obj.index_ws_Users_arr_User_to_call = index_ws_Users_arr_User_to_call;
		 	para_obj.id_ws_Users_arr_current_User = current_user_ID.ID;
		 	para_obj.id_ws_Users_arr_User_to_call = Webuser_ID_to_call;
		 	
		 	//childWorker_Videochat_Timeout.postMessage(obj_to_send);
		 	var doSetTimeout = function (parameter_obj) {
    			setTimeout(function() { ws_videochat_check_unanswered_call(parameter_obj); }, 10000);
			  };
			 doSetTimeout(para_obj);  // 10 sec ring time
	 	}; // end if OK_Flag
	 	
	 	// send result to requesting Webuser
	 	result = {};
	 	result.kind = 'Videochat_Status';
		result.Status = Status_to_return;
		result.Webuser_ID_other_Webuser = Webuser_ID_to_call;
		result.Webuser_Name_other_Webuser = null;
		result.Time_Date = new (Date);
			
		ws_Users_arr[index_ws_Users_arr_current_User].websocket.postMessage(JSON.stringify(result));
	}; // current user in array registered websockets
}; // end var ws_videochat_request_call
 
 // Videochat request terminate call
 var ws_videochat_request_terminate = function (current_user_ID, Webuser_ID_to_call) {
 	var index_ws_Users_arr_current_User = ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
	var index_ws_Users_arr_User_to_call = ws_Users_arr_get_Index_for_User_ID(Webuser_ID_to_call); // index other Webuer in array ws_Users_arr
	if (index_ws_Users_arr_User_to_call !== -1) { // Webuser to call user in array registered websockets
		if (ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID === current_user_ID.ID) { // correct User pair
			// notify called Webuser of termination
			var result = {};
		 	result.kind = 'Videochat_Status';
			result.Status = '';
			result.Webuser_ID_other_Webuser = ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID;
			result.Webuser_Name_other_Webuser = ws_Users_arr[index_ws_Users_arr_current_User].User_Name;
			result.Time_Date = new (Date);
			switch (ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Current_Status) {
				case 'videochat_status_incoming_call':
					result.Status = 'videochat_status_missed_call';
				break;
				case 'videochat_status_channel_open':
					result.Status = 'videochat_status_caller_terminated';
				break;
			}; // switch
			if (result.Status) { // new Status to send
				ws_Users_arr[index_ws_Users_arr_User_to_call].websocket.postMessage(JSON.stringify(result));
			}; // end if new Status to send
			
			// reset ws_Users_arr for called Webuser
			ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID = ''; // Other User Videochat this Webuser ID
			ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Current_Status = 'none'; // Other User Videochat current Status
		}; // end if correct user pair
	}; // Webuser to call exists in array registered websockets
	
	// reset sw_Users_arr for calling Webuer
	if (index_ws_Users_arr_current_User !== -1) { // current user exists in array registered websockets
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Other_Webuser_ID = ''; // Videochat other Webuser ID
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = 'none'; // Videochat current Status
	}; // current user exists in array registered websockets
 }; // end var ws_videochat_request_terminate
 
 // check for unanswered call, called by setTimeout
 var ws_videochat_check_unanswered_call = function (paraObj) {
	var status_to_send = '';
	var result = {};
	result.kind = 'Videochat_Status';
	result.Status = '';
	result.Webuser_ID_other_Webuser = null;
	result.Webuser_Name_other_Webuser = null;
	result.Time_Date = new (Date);

	// Check if still ringing for current user
	var websocket_calling_user_deleted = !paraObj.index_ws_Users_arr_current_User;
	var websocket_user_called_deleted = !paraObj.index_ws_Users_arr_User_to_call;	

	if (!websocket_calling_user_deleted) { // websocket calling user not deleted
		if (ws_Users_arr[paraObj.index_ws_Users_arr_current_User].Videochat_Current_Status === 'videochat_status_calling') { // still ringing for current user		 		
			// send message that called user did not answer
			result.Status = 'videochat_status_did_not_answer';
			result.Webuser_ID_other_Webuser = ws_Users_arr[paraObj.index_ws_Users_arr_current_User].Videochat_Other_Webuser_ID;
			result.Webuser_Name_other_Webuser = '';
			ws_Users_arr[paraObj.index_ws_Users_arr_current_User].websocket.postMessage(JSON.stringify(result));
			
			// reset status for called Webuser
			ws_Users_arr[paraObj.index_ws_Users_arr_current_User].Videochat_Current_Status = 'none';
			ws_Users_arr[paraObj.index_ws_Users_arr_current_User].Videochat_Other_Webuser_ID = '';
		}; // still ringing for current user
	}; // end if websocket calling user not deleted
	 
	if (!websocket_user_called_deleted) { // websocket called user not deleted
		if (ws_Users_arr[paraObj.index_ws_Users_arr_User_to_call].Videochat_Current_Status === 'videochat_status_incoming_call') { // still ringing at called user
		// send message of missed call to called Webuser
		result.Status = 'videochat_status_missed_call';
		result.Webuser_ID_other_Webuser = ws_Users_arr[paraObj.index_ws_Users_arr_current_User].User_ID;
		result.Webuser_Name_other_Webuser = ws_Users_arr[paraObj.index_ws_Users_arr_current_User].User_Name;
		
		ws_Users_arr[paraObj.index_ws_Users_arr_User_to_call].websocket.postMessage(JSON.stringify(result));
		 
		 // reset status for called Webuser
		ws_Users_arr[paraObj.index_ws_Users_arr_User_to_call].Videochat_Current_Status = 'none';
		ws_Users_arr[paraObj.index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID = '';
		}; // still ringing at called user
	}; // websocket called user not deleted
 }; // end var ws_videochat_check_unanswered_call
 
// Videochat request accept call
var ws_videochat_request_accept_call = function (current_user_ID, Webuser_ID_Caller) {
	var index_ws_Users_arr_current_User =ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
	var index_ws_Users_arr_User_Caller =ws_Users_arr_get_Index_for_User_ID(Webuser_ID_Caller); // index other Webuer in array ws_Users_arr
	
	if (index_ws_Users_arr_User_Caller !== -1) { // Calling Webuser in array registered websockets
		if (ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Other_Webuser_ID === current_user_ID.ID) { // correct User pair
			// notify called Webuser of accepted call
			var status_to_send = 'videochat_status_channel_open';
			var result = {};
		 	result.kind = 'Videochat_Status';
			result.Status = status_to_send;
			result.Webuser_ID_other_Webuser = current_user_ID.ID;
			result.Webuser_Name_other_Webuser = null;
			result.Time_Date = new (Date);
			ws_Users_arr[index_ws_Users_arr_User_Caller].websocket.postMessage(JSON.stringify(result));
			
			// set ws_Users_arr for called Webuser
			ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Current_Status = status_to_send; // Other User Videochat current Status
		}; // end if correct user pair
	}; // Calling exists in array registered websockets
	
	// set ws_Users_arr for calling Webuer
	if (index_ws_Users_arr_current_User !== -1) { // current user exists in array registered websockets
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = status_to_send; // Videochat current Status
	}; // current user exists in array registered websockets
}; // end var ws_videochat_request_accept_call 

// Videochat request decline call
var ws_videochat_request_decline_call = function (current_user_ID, Webuser_ID_Caller) {
	var index_ws_Users_arr_current_User =ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
	var index_ws_Users_arr_User_Caller =ws_Users_arr_get_Index_for_User_ID(Webuser_ID_Caller); // index other Webuer in array ws_Users_arr
	
	if (index_ws_Users_arr_User_Caller !== -1) { // Calling Webuser in array registered websockets
		if (ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Other_Webuser_ID === current_user_ID.ID) { // correct User pair
			// notify called Webuser of accepted call
			var status_to_send = 'videochat_status_caller_declined';
			var result = {};
		 	result.kind = 'Videochat_Status';
			result.Status = status_to_send;
			result.Webuser_ID_other_Webuser = current_user_ID.ID;
			result.Webuser_Name_other_Webuser = null;
			result.Time_Date = new (Date);
			ws_Users_arr[index_ws_Users_arr_User_Caller].websocket.postMessage(JSON.stringify(result));
			
			// reset ws_Users_arr for called Webuser
			ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Current_Status = 'none'; // Other User Videochat current Status
		}; // end if correct user pair
	}; // Calling exists in array registered websockets
	
	// set ws_Users_arr for calling Webuer
	if (index_ws_Users_arr_current_User !== -1) { // current user exists in array registered websockets
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = 'none'; // Videochat current Status
	}; // current user exists in array registered websockets
}; // end var ws_videochat_request_decline_call

// Videochat request decline due to hardware error
var ws_videochat_request_Decline_due_to_hardware_error = function (current_user_ID, Webuser_ID_Caller) {
	var index_ws_Users_arr_current_User =ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
	var index_ws_Users_arr_User_Caller =ws_Users_arr_get_Index_for_User_ID(Webuser_ID_Caller); // index other Webuer in array ws_Users_arr
	
	if (index_ws_Users_arr_User_Caller !== -1) { // Calling Webuser in array registered websockets
		if (ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Other_Webuser_ID === current_user_ID.ID) { // correct User pair
			// notify called Webuser of accepted call
			var status_to_send = 'videochat_status_Called_User_Webcam_Error';
			var result = {};
		 	result.kind = 'Videochat_Status';
			result.Status = status_to_send;
			result.Webuser_ID_other_Webuser = current_user_ID.ID;
			result.Webuser_Name_other_Webuser = null;
			result.Time_Date = new (Date);
			ws_Users_arr[index_ws_Users_arr_User_Caller].websocket.postMessage(JSON.stringify(result));
			
			// reset ws_Users_arr for called Webuser
			ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Current_Status = 'none'; // Other User Videochat current Status
		}; // end if correct user pair
	}; // Calling exists in array registered websockets
	
	// set ws_Users_arr for calling Webuer
	if (index_ws_Users_arr_current_User !== -1) { // current user exists in array registered websockets
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = 'none'; // Videochat current Status
	}; // current user exists in array registered websockets}; // end var ws_videochat_request_Decline_due_to_hardware_error
}; // end var ws_videochat_request_Decline_due_to_hardware_error

// Videochat request WebRTC Offer
var ws_videochat_request_WebRTC_Offer = function (current_user_ID, Webuser_ID_to_call, WebRTC_offer) {
 	var index_ws_Users_arr_current_User = ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
	var index_ws_Users_arr_User_to_call = ws_Users_arr_get_Index_for_User_ID(Webuser_ID_to_call); // index other Webuer in array ws_Users_arr
	
	if (index_ws_Users_arr_User_to_call !== -1) { // Webuser to call user in array registered websockets
		if (ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID === current_user_ID.ID) { // correct User pair
			// send offer to called user
			var result = {};
		 	result.kind = 'Videochat_Status';
			result.Status = 'videochat_status_WebRTC_Offer_received';
			result.Webuser_ID_other_Webuser = ws_Users_arr[index_ws_Users_arr_User_to_call].Videochat_Other_Webuser_ID;
			result.Webuser_Name_other_Webuser = ws_Users_arr[index_ws_Users_arr_current_User].User_Name;
			result.Time_Date = new (Date);
			result.WebRTC_offer = WebRTC_offer;
			
			ws_Users_arr[index_ws_Users_arr_User_to_call].websocket.postMessage(JSON.stringify(result));
			ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = 'videochat_status_WebRTC_Offer_received'; // Videochat current Status
		}; // end if correct user pair
	}; // Webuser to call exists in array registered websockets
	
	// set sw_Users_arr of calling Webuer
	if (index_ws_Users_arr_current_User !== -1) { // current user exists in array registered websockets
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = 'videochat_status_WebRTC_Offer_send'; // Videochat current Status
	}; // current user exists in array registered websockets
}; // end var ws_videochat_request_WebRTC_Offer


// Videochat request WebRTC Answer
var ws_videochat_request_WebRTC_Answer = function (current_user_ID, Webuser_ID_Caller, WebRTC_sessionDescription) {
	var index_ws_Users_arr_current_User =ws_Users_arr_get_Index_for_User_ID(current_user_ID.ID); // index other Webuer in array ws_Users_arr
	var index_ws_Users_arr_User_Caller =ws_Users_arr_get_Index_for_User_ID(Webuser_ID_Caller); // index other Webuer in array ws_Users_arr
	
	if (index_ws_Users_arr_User_Caller !== -1) { // Calling Webuser in array registered websockets
		if (ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Other_Webuser_ID === current_user_ID.ID) { // correct User pair
			// send answer to calling user
			var status_to_send = 'videochat_status_Answer_to_Offer_received';
			var result = {};
		 	result.kind = 'Videochat_Status';
			result.Status = status_to_send;
			result.Webuser_ID_other_Webuser = current_user_ID.ID;
			result.Webuser_Name_other_Webuser = ws_Users_arr[index_ws_Users_arr_current_User].User_Name;
			result.Time_Date = new (Date);
			result.WebRTC_sessionDescription = WebRTC_sessionDescription;
			
			ws_Users_arr[index_ws_Users_arr_User_Caller].websocket.postMessage(JSON.stringify(result));
			ws_Users_arr[index_ws_Users_arr_User_Caller].Videochat_Current_Status = 'videochat_status_Answer_to_Offer_send'; // Other User Videochat current Status
		}; // end if correct user pair
	}; // Calling exists in array registered websockets
	
	// set ws_Users_arr for calling Webuer
	if (index_ws_Users_arr_current_User !== -1) { // current user exists in array registered websockets
		ws_Users_arr[index_ws_Users_arr_current_User].Videochat_Current_Status = 'videochat_status_Answer_to_Offer_send'; // Videochat current Status
	}; // current user exists in array registered websockets
}; // end var ws_videochat_request_WebRTC_Offer
  	
  	
