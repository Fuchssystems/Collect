// functions for Chatmodule

var url = ''; // url for websocket
if (window.location.protocol == 'https:') { // https protocol
	url = 'wss://';
} // end if https protocol
else { // http protocol
	url = 'ws://';
}; // end else http protocol
url += window.location.host + '/chat'; // /chat is the path which matches the path of the  WebSocketHandler in bootstrap.js
var ws = new WebSocket(url); //logging in the webworker.  

ws.onmessage = function (event) {
	var data = JSON.parse(event.data); 
	if (data.kind) {
		switch (data.kind) {
			case 'Other_Online_Users':
				ws_Chat_Online_Status_Update(data.other_Online_Webuser_IDs);
				break;
			case 'new_chatmessage':
				ws_Chat_unread_Messages_Update(data.Webuser_w_unread_Message_ID);
				break;
			case 'Videochat_Status':
				ws_Videochat_Status_received(data);
				break;	
			}; // end switch
	}; // end if
};

ws.onopen = function () {
	var obj_to_send = {
		kind: 'open',
		user_ID: WAF_directory_currentUser.ID
	}; // end var obj_to_send
	ws.send(JSON.stringify(obj_to_send));
};

// update online status of other webusers
var ws_Chat_Online_Status_Update = function (arr_Online_Other_Webuser_IDs) {
	// check all other users in matrix for change of online status
	var Other_Webuser_Status = false;
	for (var i = 0, len = arr_other_Webusers_Online_Status.length; i < len; i++) {
		Other_Webuser_Status = (arr_Online_Other_Webuser_IDs.indexOf(arr_other_Webusers_Online_Status[i].Webuser_ID) !== -1);
		if (arr_other_Webusers_Online_Status[i].Status !== Other_Webuser_Status) { // Status changed
			arr_other_Webusers_Online_Status[i].Status = Other_Webuser_Status;
			if (Other_Webuser_Status) { // Webuser is online			
				$$(arr_other_Webusers_Online_Status[i].richText_Status_ID).setValue(gStr_Localized_Get('Other_User_is_online', locStr_Char));
				$$(arr_other_Webusers_Online_Status[i].richText_Status_ID).addClass('Online_Status_true');
			} // end if Webuser is online
			else { // Webuser offline
				$$(arr_other_Webusers_Online_Status[i].richText_Status_ID).setValue('');
				$$(arr_other_Webusers_Online_Status[i].richText_Status_ID).removeClass('Online_Status_true');
			}; // end if Webuser is online
			
			// update status in Profile windows
			for (var k = 0, k_len = Chat_Components.length; k < k_len; k++) {
				if (Chat_Components[k].Current_Webuser_ID === arr_other_Webusers_Online_Status[i].Webuser_ID) { // Webuser Profile displayed in component
					$$(Chat_Components[k].Component_id).Profile_Load(arr_other_Webusers_Online_Status[i].Webuser_ID, k); // reload profile in component window
				}; // Webuser Profile displayed in component
			}; // end for
		}; // end if Status changed	
	}; // end for	
}; // end var ws_Chat_Online_Status_Update

// update unread messages
var ws_Chat_unread_Messages_Update = function (Webuser_w_unread_Message_ID) {
	for (var i = 0, len = arr_other_Webusers_Online_Status.length; i < len; i++) {
		var index = -1;
		if (arr_other_Webusers_Online_Status[i].Webuser_ID === Webuser_w_unread_Message_ID) { // Webuser in array online status
			index = i;
			break;
		}; //end if // Webuser in array online status
	}; // end for
	if (index !== -1) { // ID exists in array of other Webusers
		// check if other Webuser is opend in a profile window
		var Chat_Component_Index = -1; // Arrayindex Chat_Components
		for (var k = 0, k_len = Chat_Components.length; k < k_len; k++) {
			if (Chat_Components[k].Current_Webuser_ID === Webuser_w_unread_Message_ID) { // Webuser Profile displayed in component
			Chat_Component_Index = k;
			break;			}; // Webuser Profile displayed in component
		}; // end for
		
		if (Chat_Component_Index === -1) { // other Webuser not opened in a profile window
			if (!arr_other_Webusers_Online_Status[i].has_Unread_Messages) { // Status changed
				arr_other_Webusers_Online_Status[i].has_Unread_Messages = true;

				$$(arr_other_Webusers_Online_Status[i].image_id_has_Unread_Messages).show();
			}; // end if Status changed		
		} // end if other Webuser not opened in a profile window
		else { // other Webuser opened in a profile window
			$$(Chat_Components[Chat_Component_Index].Component_id).Chatmessages_Load(); // tell profile window to load chatmessages
		}; // end else other Webuser opened in profile window
	}; // end if ID exists in array of other Webusers
}; // end var ws_Chat_unread_Messages_Update