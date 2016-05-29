
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Profile, $comp.id); // localize DOM from localization object
		if (this.Current_Webuser_ID) { // other Webuser displayed
			var richText_id = $comp.id + '_richText_Profile_Details';
			$$(richText_id).setValue(Profile_Detail_Text_Make($$($comp.id).source_user_in_profile));
		}; // end if other Webuser displayed
	}; // end this.localize
	
	// refresh Chat flow - called called from outside
	this.Chatmessages_Load = function () {
		Profile_Chat_Body_Load($$($comp.id).Current_Webuser_ID, getHtmlId('richText_Chat'));
	}; // end this.Chattmessage_Load
	
	this.source_user_in_profile = sources[id + '_user_in_Profile'];
	this.source_connection = sources[id + '_connection'];
	this.Current_Webuser_ID = ''; // Current Webuser ID of Profile
	this.Current_Index_Array_Chat_Components = -1; // current index Array Chat_Components
		
	// function to load Profile
	this.Profile_Load = function (Webuser_ID_to_load, Index_Array_Chat_Components) {
		this.Current_Webuser_ID = Webuser_ID_to_load;
		this.Current_Index_Array_Chat_Components = Index_Array_Chat_Components;
		this.source_user_in_profile.query('Directory_ID == :1',
			{
				onSuccess: function (event) {
					// Online status of other user
					var richText_id = $comp.id + '_richText_Status_Online';
					if ($$($comp.id).source_user_in_profile.Is_Online_Calculated) { // Webuser is online
						$$(richText_id).setValue(gStr_Localized_Get('Other_User_is_online', locStr_Profile));
						$$(richText_id).addClass('Other_Online_Status_true');
						$$(richText_id).removeClass('Other_Online_Status_false');
						$$(richText_id).setTextColor('red');
					} // end if Webuser is online
					else { // Webuser offline
						$$(richText_id).setValue(gStr_Localized_Get('Other_User_is_offline', locStr_Profile));
						$$(richText_id).setTextColor('blue');
						$$(richText_id).addClass('Other_Online_Status_false');
						$$(richText_id).removeClass('Other_Online_Status_true');
					}; // end if Webuser is online
					
					// button Videochat
					var button_id = $comp.id + '_button_Videochat_Open';
					if ($$($comp.id).source_user_in_profile.Videochat_Activated
						&& sources.webuser.Videochat_Activated
						&& Videochat_Window_is_available()) { // both Webusers have Videochat activated and videochat window is available
						$$(button_id).enable();
					} // end if Webuser is online
					else { // at least 1 Webuser has not activated Videochat or videochat window is occupied
						$$(button_id).disable();
					}; // end if // both Webusers have Videochat activated and videochat window is available
					
					// Profile detail text				
					var richText_id = $comp.id + '_richText_Profile_Details';
					$$(richText_id).setValue(Profile_Detail_Text_Make($$($comp.id).source_user_in_profile));
					
					Profile_Chat_Body_Load($$($comp.id).Current_Webuser_ID, getHtmlId('richText_Chat'));
				}, // end onSuccess
				
				onError: function(error) {
					alert('Error this.source_user_in_profile.query()')
				} // end onError
			},
			 Webuser_ID_to_load
		); // end .query()
		
		// load/create entity Connection
		$$($comp.id).source_connection.Load_Create(
			{
				onSuccess: function (event) {

				}, // end onSuccess
				onError: function(error) {
					alert('Error sources.connection.Load_Create()')
				} // end onError
			},
			 Webuser_ID_to_load
		); // end .Load_Create()
	}; // end this.Profile_Load
	
	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Profile';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		
	this.localize(); // localize DOM of from localization object
	
	// @region namespaceDeclaration// @startlock
	var button_Videochat_Open = {};	// @button
	var button_Message_Send = {};	// @button
	var button_Pictures_Show = {};	// @button
	var imageButton_Close = {};	// @buttonImage
	// @endregion// @endlock

	// eventHandlers// @lock

	button_Videochat_Open.click = function button_Videochat_Open_click (event)// @startlock
	{// @endlock
		Videochat_Call_Main($comp.source_user_in_profile); // Open Videochat Window
	};// @lock

	button_Message_Send.click = function button_Message_Send_click (event)// @startlock
	{// @endlock
		var id_Message_New = getHtmlId('textField_Message_New');
		var val_Message_New = $$(id_Message_New).getValue();
		if(val_Message_New) { // messagetext defined
			ds.Chatmessage.Message_New({
				onSuccess:function(event) {	
					if (event.result.Chattext) { // Updates Chaattext returned
						var id_Chattext = getHtmlId('richText_Chat');
						$$(id_Chattext).setValue(event.result.Chattext);
					}; // end if Updates Chaattext returned			
					if(event.result.error_text) { 
						alert(gStr_Localized_Get(event.result.error_text, locStr_Profile, null, event.result.error_params));
					};					
				},
				onError:function(error) {
					alert('OnError ds.Chatmessage.Message_New(');
				}
			},val_Message_New, $$($comp.id).Current_Webuser_ID); // end sources.webuser.Modify_Username
			
			$$(id_Message_New).setValue('');
		}; // end if  messagetext defined
	};// @lock

	button_Pictures_Show.click = function button_Pictures_Show_click (event)// @startlock
	{// @endlock
		// Show all picturs for chat partner in matrix in outer main window
		sources.component_Main_user_Documents.query('Webuser.Directory_ID == :1',
			{
				orderBy: 'Main_Picture desc, ID asc',
				onSuccess: function (event) {
					$$('component_Main_matrix_Profile_Pictures').show(); // show picture matrix
					Pictures_in_Chat_Matrix_Webuser_ID = $$($comp.id).Current_Webuser_ID; // Webuser ID of displayed pictures in main chat window
				}, // end onSuccess
				onError: function(error) {
					alert('Error sources.component_Main_user_Documents.query()')
				} // end onError
			},
			 $$($comp.id).Current_Webuser_ID
		); // end .query()
	};// @lock

	imageButton_Close.click = function imageButton_Close_click (event)// @startlock
	{// @endlock
		$$($comp.id).source_user_in_profile.removeCurrentReference();	
		this.Current_Webuser_ID = '';
		this.Current_Index_Array_Chat_Components = -1;	
		Chat_Components_Window_Close($$($comp.id).Current_Index_Array_Chat_Components);

	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_button_Videochat_Open", "click", button_Videochat_Open.click, "WAF");
	WAF.addListener(this.id + "_button_Message_Send", "click", button_Message_Send.click, "WAF");
	WAF.addListener(this.id + "_button_Pictures_Show", "click", button_Pictures_Show.click, "WAF");
	WAF.addListener(this.id + "_imageButton_Close", "click", imageButton_Close.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
