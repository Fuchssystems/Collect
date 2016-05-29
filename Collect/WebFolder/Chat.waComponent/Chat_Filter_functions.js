// functions Chatfilter

// Chatfilter object Initilize
// object component_Main_obj_Chatfilter is defined by local datasource
var component_Main_obj_Chatfilter = {};
var Chatfilter_obj_Init = function () {
	component_Main_obj_Chatfilter.Gender_Female = false;
	component_Main_obj_Chatfilter.Gender_Male = false;
	component_Main_obj_Chatfilter.Gender_Undetermined = false;
	component_Main_obj_Chatfilter.Online = false;
	component_Main_obj_Chatfilter.Unread_Messages = false;
	component_Main_obj_Chatfilter.Webcam = false;	
	component_Main_obj_Chatfilter.Age_Years_Minimum = '';
	component_Main_obj_Chatfilter.Age_Years_Maximum = '';
	component_Main_obj_Chatfilter.Distance = '';
}; // end var Chatfilter_obj_Init

// Load chatfilter object
var Chatfilter_obj_Load = function () {
	Chatfilter_obj_Init();
	ds.Webuser_Preference.Load_Preference_Current_Webuser(
		{
			onSuccess: function(event) {
				if (event.result) {
					component_Main_obj_Chatfilter.Gender_Female = event.result.Chatfilter_Gender_Female.getValue();
					component_Main_obj_Chatfilter.Gender_Male = event.result.Chatfilter_Gender_Male.getValue();
					component_Main_obj_Chatfilter.Gender_Undetermined = event.result.Chatfilter_Gender_Undetermined.getValue();
					component_Main_obj_Chatfilter.Online = event.result.Chatfilter_Online.getValue();
					component_Main_obj_Chatfilter.Unread_Messages = event.result.Chatfilter_Unread_Messages.getValue();
					component_Main_obj_Chatfilter.Webcam = event.result.Chatfilter_Webcam.getValue();	
					component_Main_obj_Chatfilter.Age_Years_Minimum = event.result.Chatfilter_Age_Years_Minimum.getValue();
					component_Main_obj_Chatfilter.Age_Years_Maximum = event.result.Chatfilter_Age_Years_Maximum.getValue();
					component_Main_obj_Chatfilter.Distance = event.result.Chatfilter_Distance.getValue();
					sources_component_Main_obj_Chatfilter_No_Change_Event = false; // Flag do not handle on Change event of datasource
				}; // end if event.result
				Chatfilter_UI_Elements_Set(); // set user interface elements of Chatfilter
			}, // end onSuccess:
			onError: function(error) {
				alert('Error Chatfilter_obj_Load');
			} // end onError
		}
	);// ds.Webuser_Preference.Load_Preference_Current_Webuser
}; //

// set user interface elements of Chatfilter
var Chatfilter_UI_Elements_Set = function () {
	// set checkboxes
	$$('component_Main_checkbox_Chatfilter_Gender_Female').setValue(component_Main_obj_Chatfilter.Gender_Female);
	$$('component_Main_checkbox_Chatfilter_Gender_Male').setValue(component_Main_obj_Chatfilter.Gender_Male);
	$$('component_Main_checkbox_Chatfilter_Gender_Undetermined').setValue(component_Main_obj_Chatfilter.Gender_Undetermined);
	$$('component_Main_checkbox_Chatfilter_Online').setValue(component_Main_obj_Chatfilter.Online);
	$$('component_Main_checkbox_Chatfilter_Unread_Messages').setValue(component_Main_obj_Chatfilter.Unread_Messages);
	$$('component_Main_checkbox_Chatfilter_Webcam').setValue(component_Main_obj_Chatfilter.Webcam);
	$$('component_Main_textField_Chatfilter_Age_Minimum').setValue(component_Main_obj_Chatfilter.Age_Years_Minimum);
	$$('component_Main_textField_Chatfilter_Age_Maximum').setValue(component_Main_obj_Chatfilter.Age_Years_Maximum);
	$$('component_Main_textField_Chatfilter_Distance').setValue(component_Main_obj_Chatfilter.Distance);
}; // end var Chatfilter_UI_Elements_Set

// Query other webusers with Chatfilter
var Chatfilter_Query = function (obj_Chatfilter) {
	Chat_Load_Webusers(obj_Chatfilter); // load other webuser from server in datasource
};
