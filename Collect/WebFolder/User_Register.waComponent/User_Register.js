
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'User_Register';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		language_Set_DOM_from_Object(app_Languages.current_set, locObj_Register, $comp.id); // localize DOM of from localization object
		
		// set URL to open to show AGB in new browser window
		var URL = '/Content_in_window/?content=AGB&language=' + app_Languages.current_set;
		$$(getHtmlId('button_Show_AGB')).setURL(URL);
		
		var validate_Fields_Register = function () {
			var ok_Flag = true;
			var id_login_Name = getHtmlId('login_Name');
			var val_login_Name = $$(id_login_Name).getValue();
			if(!val_login_Name){
				alert(gStr_Localized_Get('No_name_entered', locStr_Register));
				ok_Flag = false;
				$$(id_login_Name).focus();
			};
			
			if(ok_Flag) {
				var id_login_email = getHtmlId('login_email');
				var val_login_email = $$(id_login_email).getValue();
				if(!val_login_email){
					alert(gStr_Localized_Get('No_email_entered', locStr_Register));
					ok_Flag = false;
					$$(id_login_email).focus();
				};
			}; // ok_Flag			
			if(ok_Flag) {
				ok_Flag = (val_login_email.indexOf('@') > -1) && (val_login_email.indexOf('.') > -1);
				if(!ok_Flag){
					alert(gStr_Localized_Get('Invalid_email_format', locStr_Register));
					ok_Flag = false;
					$$(id_login_email).focus();
				};
			}; // ok_Flag
				
			if(ok_Flag) {
				var id_login_Password = getHtmlId('login_Password');
				var val_login_Password = $$(id_login_Password).getValue();
				if(!val_login_Password){
					alert(gStr_Localized_Get('No_password_entered', locStr_Register));
					ok_Flag = false;
					$$(id_login_Password).focus();
				};
			}; // ok_Flag
			
			if(ok_Flag) {
				var id_login_AGB = getHtmlId('login_checkbox_AGB');
				var val_login_AGB = $$(id_login_AGB).getValue();
				if(!val_login_AGB){
					alert(gStr_Localized_Get('AGB_not_accepted', locStr_Register));
					ok_Flag = false;
					$$(id_login_AGB).focus();
				};
			}; // ok_Flag
			
			return ok_Flag;
		};  // end var validate_Fields_Register

		var WAF_directory_loginByPassword = function () {
			var id_login_Name = getHtmlId('login_Name');
			var val_login_Name = $$(id_login_Name).getValue();
			var id_login_Password = getHtmlId('login_Password');
			var val_login_Password = $$(id_login_Password).getValue();
			
			WAF.directory.loginByPassword({
				onSuccess:function(event) { 
					if(event.result == true) { // webuser logged in
						sources.webuser.Preferences_Load({
							onSuccess:function(event) {
								if (true) { // version forcing page reload to rebuild jqx menu
									if (data.userData.program_ID_after_login) { // program id to load after login passed
										sources.webuser.setCurrentEntity(event.result);
										sources.webuser.Program_ID_Last_Used = data.userData.program_ID_after_login; // component that will be loaded on page reload
										sources.webuser.save( {
											onSuccess:function(event) {
												location.reload(true); // force page reload	
											}, // end onSuccess
											onError:function(error) {
												alert('onError sources.webuser.save()');
											} // end onError
										}); // end sources.webuser.save()
									} // end if program id to load after login passed
									else { // no program id to load after login passed
										location.reload(true); // force page reload							
									};	// end else no program id to load after login passed
								} // end if version forcing page reload to rebuild jqx menu
								else { // old version that would be used if jqx menu would allow to add items
									sources.webuser.setCurrentEntity(event.result);
									$$(id).removeComponent(); // close modal dialog
									widget_Pos_Saved = JSON.parse(sources.webuser.Widget_Positions_JSON);  // saved widget positions
									if (!widget_Pos_Saved) widget_Pos_Saved_Initialize();
									language_Set_Main(); // localize
									if (!data.userData.program_ID_after_login) { // no program id to load after login passed
										if(sources.webuser.Program_ID_Last_Used) { // last used program part defined
											prog_Main_Select(sources.webuser.Program_ID_Last_Used, false); // select program part, do not save user preferences
										}; // last used program part defined
									} // end if no program id to load after login passed
									else { // program id to load after login passed
										prog_Main_Select (data.userData.program_ID_after_login,true) // select main component, save user preferences
									}; // end else program id to load after login passed								
								}; // end else old version that would be used if jqx menu would allow to add items								
						}, onError: function(error) {
							alert('Error sources.webuser.Preferences_Load()');
							}
						}); // end sources.webuser.Preferences_Load
					} // end if webuser logged in
					else { // no webuser found
						alert(gStr_Localized_Get('No_webuser_found', locStr_Register));
						$$(id_login_Name).focus();
					}; // end else no webuser found
    		  }, onError:function(error) {
    		  	alert('Error .loginByPassword');
    		  }
			}, val_login_Name, val_login_Password); // end WAF.directory.loginByPasswor
		};  // end var WAF_directory_loginByPassword

	// @region namespaceDeclaration// @startlock
	var button_Register_OK = {};	// @button
	var button_Register_Cancel = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	button_Register_OK.click = function button_Register_OK_click (event)// @startlock
	{// @endlock
		if(validate_Fields_Register()) {
			var id_login_Name = getHtmlId('login_Name');
			var val_login_Name = $$(id_login_Name).getValue();
			var id_login_Password = getHtmlId('login_Password');
			var val_login_Password = $$(id_login_Password).getValue();
			var id_login_email = getHtmlId('login_email');
			var val_login_email = $$(id_login_email).getValue();
			
			sources.webuser.User_Register_New({
				onSuccess:function(event) {
					if(!event.result.error_text) { 
						alert(gStr_Localized_Get('Confirmation_email_has_been_send', locStr_Register, null, event.result.error_params));
						$$(id).removeComponent(); // close modal dialog
						//WAF_directory_loginByPassword();
					}
					else {
						alert(gStr_Localized_Get(event.result.error_text, locStr_Register, null, event.result.error_params));
						$$(id_login_Name).focus();
					};
				},
				onError:function(error) {
					console.log(error);
					alert('OnError sources.webuser.User_Register_New');
				}
			},val_login_Name,val_login_Password, val_login_email, app_Languages.current_set, window.location.host); // end sources.webuser.Modify_Username
		}; // end if validate_Fields_Register
	};// @lock

	button_Register_Cancel.click = function button_Register_Cancel_click (event)// @startlock
	{// @endlock
		$$(id).removeComponent(); // close modal dialog
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_button_Register_OK", "click", button_Register_OK.click, "WAF");
	WAF.addListener(this.id + "_button_Register_Cancel", "click", button_Register_Cancel.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
