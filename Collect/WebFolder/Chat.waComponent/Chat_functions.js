// functions component User Payments

// array other webuser online status / with unread messages - set on childredraw of matrix
var arr_other_Webusers_Online_Status = [];
// Load Webusers from server
var Chat_Load_Webusers = function (obj_Chatfilter) {
	ds.Webuser.Chat_Other_Members_Load(
		{
			onSuccess: function(event) {
				arr_other_Webusers_Online_Status = []; // array other webuser online status
				sources.component_Main_other_Members.setEntityCollection(event.result);
			}, // end onSuccess:
			onError: function(error) {
				alert('OnError ds.Chat_Load_Webusers');
			} // end onError
		}, obj_Chatfilter
	); // end ds.Picture_synchronized.Query_PictureCategory	
}; // end var Chat_Load_Webusers

// Initialize Chat components
Chat_Components = []; // Array chat components
var Chat_Components_Init = function() {
	for (var i = 0, len = 2; i < len; i++) {
		Chat_Components[i] = {};
		Chat_Components[i].Component_id = 'component_Main_component_Profile_' + (i + 1);
		Chat_Components[i].Current_Webuser_ID = ''; // current webuser ID
	}; // end for
}; 

// get next free component id
var Chat_Components_get_Free_index = function(Webuser_ID_to_open) {
	var index_to_return = -1;
	for (var i = 0, len = Chat_Components.length; i < len; i++) {
		if (index_to_return === -1) { // still no free id
			if (Chat_Components[i].Current_Webuser_ID == '') { // unused id
				index_to_return = i;
			}; // end if unused id
		}; // end if still no free id
		if (Chat_Components[i].Current_Webuser_ID === Webuser_ID_to_open) { // Webuser Profile already viewed
			index_to_return = -2;
			break;
		}; // Webuser Profile already viewed 
	}; // end for
	return index_to_return;
}; // end var Chat_Components_get_Free_id


// Webuser (Chatpartner) clicked in matrix
var Chatpartner_Clicked = function(event) {
	if (sources.component_Main_other_Members.Directory_ID) { // Click on Webuser
		var free_index = Chat_Components_get_Free_index(sources.component_Main_other_Members.Directory_ID); // get next free component id
		if (free_index >= 0) { //  free component id available
			Chat_Components[free_index].Current_Webuser_ID = sources.component_Main_other_Members.Directory_ID;
			$$(Chat_Components[free_index].Component_id).show();
			$$(Chat_Components[free_index].Component_id).Profile_Load(sources.component_Main_other_Members.Directory_ID, free_index); // load profile in component window
		
			// hide unread messages symbol
			var index = -1;
			for (var i = 0, len = arr_other_Webusers_Online_Status.length; i < len; i++) {
				if (arr_other_Webusers_Online_Status[i].Webuser_ID === sources.component_Main_other_Members.Directory_ID) { // Webuser in array online status
					index = i;
					break;
				}; //end if // Webuser in array online status
			}; // end for
			if (index !== -1) { // Webuser in array online status
				if (arr_other_Webusers_Online_Status[index].has_Unread_Messages) { // Webuser has unread messages symbol
					arr_other_Webusers_Online_Status[index].has_Unread_Messages = false;
					$$(arr_other_Webusers_Online_Status[index].image_id_has_Unread_Messages).hide('visibility');
				}; // end if // Webuser has unread messages symbol
			}; // end if Webuser in array online status
			
		} // end if get next free component id
		else { // no free component id
			switch (free_index) {
				case -1:
					alert(gStr_Localized_Get('No_more_open_Chatwindows', locStr_Char));	
					break;
				case -2:
					alert(gStr_Localized_Get('Profile_already_opened', locStr_Char));	
					break;			
			}; // end switch			
		};  // end else no free component id
	}; // Click on Webuser
}; // end variable Chatpartner_Clicked

// close Profile window
var Chat_Components_Window_Close = function(Index_Array_Chat_Components) {
	if (Index_Array_Chat_Components >= 0 && Index_Array_Chat_Components < Chat_Components.length) { // valid array index
		// hide pictures in matrix of main chat window if from closed profile
		if (Chat_Components[Index_Array_Chat_Components].Current_Webuser_ID === Pictures_in_Chat_Matrix_Webuser_ID) { // picture matrix shown from this user
			sources.component_Main_user_Documents.setEntityCollection();
			$$('component_Main_matrix_Profile_Pictures').hide(); // hide picture matrix
		}; // end if picture matrix shown from this user
		
		$$(Chat_Components[Index_Array_Chat_Components].Component_id).hide(); // hide profile component
		Chat_Components[Index_Array_Chat_Components].Current_Webuser_ID = "";
	}; // end if valid array index
}; // end var Chat_Components_Window_Close