// function for index page custom to this project

// check if current status of logged in Webuser allows opening of program id
var check_current_User_status_for_access_for_program_id = function (id, logged_in_Flag) {
	var result = true;
	if (logged_in_Flag) { // current user is logged in
		if (id === 'Chat') { // check for program chat
			result = !sources.webuser.Profile_Deactivated;
			if (!result) { // profile is deaktivated
			alert(gStr_Localized_Get('Profile_is_deactivated_no_chat', locObj_Main));
			}; // end if profile is deactivated
		}  // end if check for program chat
	}; // current user is logged in
	return result;
}; // end var check_current_User_status_for_access_for_program_id
