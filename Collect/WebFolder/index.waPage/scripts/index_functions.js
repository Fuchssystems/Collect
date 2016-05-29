// functions for index page

// check for link for confirmation of registration
var index_URL_Registration_Confirmation = function () {
	var URL_Value = URL_Value_Object_from_URL_Path(window.location.search); // get value object for key=value pairs in browser URL
	if (URL_Value.Confirmation_ID) { // URL has language parameter
		ds.Webuser.Confirm_Registration(
			{
				onSuccess: function (event) {
					switch (event.result) {
						case 'confirmation_OK':
							alert(gStr_Localized_Get('Registration_Confirmation_OK', locObj_Main));
							break;
						case 'already_confirmed':
							alert(gStr_Localized_Get('Registration_Confirmation_already_confirmed', locObj_Main));
							break;	
						default:
							alert(gStr_Localized_Get('Registration_Confirmation_invalid_link', locObj_Main));
					}; // end switch
					window.location.search = ''; // remove URL parameters and reload
				}, // end onSuccess
				onError: function (error) {
					alert('Error ds.Webuser.Confirm_Registration');
				} // end onError
			},
			URL_Value.Confirmation_ID
		); // end ds.Webuser.Confirm_Registration
	}; // end if URL has language parameter
}; // end var 

