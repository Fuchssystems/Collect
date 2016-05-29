
WAF.onAfterInit = function onAfterInit() {// @lock
	WAF_directory_currentUser = WAF.directory.currentUser(); // cache current user
	WAF_directory_currentUser_Belongs_to_Admin_Webuser = waf.directory.currentUserBelongsTo("Admin_Webuser"); // Flag current user belongs to group Admin
	menu_Set_Main (); // set up main menu bar
	language_Set_Main(null,false,true); // localize
	if (WAF_directory_currentUser) { // user logged in
		sources.webuser.Preferences_Load({
			onSuccess:function(event) {
				sources.webuser.setCurrentEntity(event.result);
				widget_Pos_Saved = '';
				if (sources.webuser.Widget_Positions_JSON) { // saved positions defined
					widget_Pos_Saved = JSON.parse(sources.webuser.Widget_Positions_JSON);  // saved widget positions
					widget_Pos_Saved_Initialize();
					widget_Drag_Parameters_Set('Main'); // initialize draggable widget with saved positions
					widget_position_restore ('Main'); // move widgets to saved positions (after dragging)
				}; // end if saved positions defined
				language_Set_Main(); // localize
				if(sources.webuser.Program_ID_Last_Used) { // last used program part defined
					prog_Main_Select(sources.webuser.Program_ID_Last_Used, false); // select program part, do not save user preferences
				} // end if last used program part defined
				else {  // no last used program part defined
				 	prog_Main_Select('Logged_in_Base', false); // select Home, do not save user preferences
				}; // end else no last used program part defined
			},
		 	onError: function(error) {
				alert('Error sources.webuser.Preferences_Load()');
			}
		}); // end sources.webuser.Preferences_Load
	} // end ifuser logged in
	else { // no user logged in
		index_URL_Registration_Confirmation(); // check for link for confirmation of registration
		prog_Main_Select('Home', false); // select Home, do not save user preferences
	};// end else no user logged in

// @region namespaceDeclaration// @startlock
	var button_My_camera_close = {};	// @button
	var button5 = {};	// @button
	var button4 = {};	// @button
	var button_Register = {};	// @button
	var button_Log_In_Out = {};	// @button
	var imageButton_Language_en = {};	// @buttonImage
	var imageButton_Language_de = {};	// @buttonImage
// @endregion// @endlock

// eventHandlers// @lock

	button_My_camera_close.click = function button_My_camera_close_click (event)// @startlock
	{// @endlock
		myWebcam_Container_hide();
	};// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //ok button
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //cancel button
	};// @lock

	button_Register.click = function button_Register_click (event)// @startlock
	{// @endlock
		user_Register_Main();
	};// @lock

	button_Log_In_Out.click = function button_Log_In_Out_click (event)// @startlock
	{// @endlock
		user_LogInOut_Main();
	};// @lock

	imageButton_Language_en.click = function imageButton_Language_en_click (event)// @startlock
	{// @endlock
		language_Set_Main('en');
	};// @lock

	imageButton_Language_de.click = function imageButton_Language_de_click (event)// @startlock
	{// @endlock
		language_Set_Main('de');
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button_My_camera_close", "click", button_My_camera_close.click, "WAF");
	WAF.addListener("button5", "click", button5.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button_Register", "click", button_Register.click, "WAF");
	WAF.addListener("button_Log_In_Out", "click", button_Log_In_Out.click, "WAF");
	WAF.addListener("imageButton_Language_en", "click", imageButton_Language_en.click, "WAF");
	WAF.addListener("imageButton_Language_de", "click", imageButton_Language_de.click, "WAF");
// @endregion
};// @endlock
