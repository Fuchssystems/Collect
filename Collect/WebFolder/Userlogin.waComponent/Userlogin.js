
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Userlogin';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		language_Set_DOM_from_Object(app_Languages.current_set, locObj_Log_Dialog, $comp.id); // localize DOM from localization object
		
		var validate_Name_Password = function () {
			var ok_Flag = true;
			var id_login_Name = getHtmlId('login_Name');
			var val_login_Name = $$(id_login_Name).getValue();
			if(!val_login_Name){
				alert(gStr_Localized_Get('No_name_or_email_entered', locStr_Log_Dialog));
				ok_Flag = false;
				$$(id_login_Name).focus();
			};
			if(ok_Flag) {
				var id_login_Password = getHtmlId('login_Password');
				var val_login_Password = $$(id_login_Password).getValue();
				if(!val_login_Password){
					alert(gStr_Localized_Get('No_password_entered', locStr_Log_Dialog));
					ok_Flag = false;
					$$(id_login_Password).focus();
				};
			}; // ok_Flag
			return ok_Flag;
		};  // end var validate_Name_Password
		
		var WAF_directory_loginByPassword = function () {
			var id_login_Name = getHtmlId('login_Name');
			var val_login_Name = $$(id_login_Name).getValue();
			var id_login_Password = getHtmlId('login_Password');
			var val_login_Password = $$(id_login_Password).getValue();
			
			var login_result = WAF.directory.loginByPassword({
				onSuccess:function(event) { 
					if(event.result == true) { // webuser logged in				
						sources.webuser.Preferences_Load({
							onSuccess:function(event) {
								if (!event.result.Registration_Pending.value) { // registration not pending
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
								} // end if registration not pending
								else { // registration pending
									alertify.set({ labels: {
									    ok     : gStr_Localized_Get('button_Account_not_conirmed_OK', locStr_Log_Dialog),
									    cancel : gStr_Localized_Get('button_Account_not_conirmed_Send_Again', locStr_Log_Dialog)
									}}); // end alertify.set
									alertify.confirm(gStr_Localized_Get('Account_not_confirmed', locStr_Log_Dialog), function (e) {
									    if (!e) { // user clicked cancel = send again
									   		sources.webuser.Registraion_Confirm_email_resend(); // resend confirmation email									    	
											alert(gStr_Localized_Get('Confirmation_email_has_been_resend', locStr_Log_Dialog));
									    } // end if user clicked ok
									WAF.directory.logout();
									$$(id).removeComponent(); // close modal dialog
									}); // end alertify.confirm										
								}; // registration pending							
							}, // end onSuccess
							onError: function(error) {
								alert('Error sources.webuser.Preferences_Load()');
							} // end onError
						}); // end sources.webuser.Preferences_Load
					} // end if webuser logged in
					else { // no webuser found or not confirmed
						alert(gStr_Localized_Get('No_webuser_found', locStr_Log_Dialog));
						$$(id_login_Name).focus();
					}; // end else no webuser found or not confirmed
    		  }, onError:function(error) {
    		  	alert('Error .loginByPassword');
    		  }
			}, val_login_Name, val_login_Password); // end WAF.directory.loginByPasswor
		};  // end var WAF_directory_loginByPassword
		
	// @region namespaceDeclaration// @startlock
	var button_Login_Login = {};	// @button
	var button_Login_Cancel = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	button_Login_Login.click = function button_Login_Login_click (event)// @startlock
	{// @endlock
		if(validate_Name_Password()) {		
			WAF_directory_loginByPassword();
		}; // end if validate_Name_Password
	};// @lock

	button_Login_Cancel.click = function button_Login_Cancel_click (event)// @startlock
	{// @endlock
		$$(id).removeComponent(); // close modal dialog
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_button_Login_Login", "click", button_Login_Login.click, "WAF");
	WAF.addListener(this.id + "_button_Login_Cancel", "click", button_Login_Cancel.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
