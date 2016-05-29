
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.Profile_Activated_Deactivated_Display = function () {
		if (sources.webuser.Profile_Deactivated) { // Profile activated
			$$('component_Main_richText_Label_Deactivate').setValue(gStr_Localized_Get('richText_Label_Activate', locStr_User_Profile));
			$$('component_Main_richText_Comment_Deactivate').setValue(gStr_Localized_Get('richText_Comment_Activate', locStr_User_Profile));
			$$('component_Main_button_Deactivate_Save').setValue(gStr_Localized_Get('button_Activate_Save', locStr_User_Profile));
			$$('component_Main_richText_Title').setValue(gStr_Localized_Get('richText_Title_Deactivated', locStr_User_Profile));
		} // end if Profile activated
		else { // Profile deactivated
			$$('component_Main_richText_Label_Deactivate').setValue(gStr_Localized_Get('richText_Label_Deactivate', locStr_User_Profile));
			$$('component_Main_richText_Comment_Deactivate').setValue(gStr_Localized_Get('richText_Comment_Deactivate', locStr_User_Profile));
			$$('component_Main_button_Deactivate_Save').setValue(gStr_Localized_Get('button_Deactivate_Save', locStr_User_Profile));
			$$('component_Main_richText_Title').setValue(gStr_Localized_Get('richText_Title_Activated', locStr_User_Profile));
		}; // end if Profile deactivated
	}; // end this.Profile_Activated_Deactivated_Display 
	
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
		// jqx combobox Profile gender
		if (sources.webuser.Preferences_Language_Shortcut) { // language definded for user
			// var theme = getTheme();	jqx v2.6
			// version disabled: jqx 2.6 with theme
			// $('#component_Main_container_jqxMenu_Profile_Gender').jqxDropDownList({placeHolder: gStr_Localized_Get('jqxDropDown_Gender_Placeholder', locStr_User_Profile), source: locStr_User_Profile[sources.webuser.Preferences_Language_Shortcut].Array_Gender, enableSelection: true, width: '150', height: '22px', theme: theme });	
			$('#component_Main_container_jqxMenu_Profile_Gender').jqxDropDownList({placeHolder: gStr_Localized_Get('jqxDropDown_Gender_Placeholder', locStr_User_Profile), source: locStr_User_Profile[sources.webuser.Preferences_Language_Shortcut].Array_Gender, enableSelection: true, width: '150', height: '22px'});			
			if (sources.webuser.Gender) { // Gender defined in Webuser Profile
				var index = locStr_User_Profile.key.Array_Gender.indexOf(sources.webuser.Gender);
				if (index !== -1) $('#component_Main_container_jqxMenu_Profile_Gender').jqxDropDownList('selectIndex', index);
			}; // end if Gender defined in Webuser Profile
		}; // end if language definded for user
		this.Profile_Activated_Deactivated_Display(); // set activated/deactivated state
	}; // end this.localize
	
	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'User_Profile';
	// @endregion// @endlock

	this.load = function (data) {// @lock
	// set activated/deactivated state
	this.localize(); // localize DOM of from localization object
		
	User_Documents_Load(); // load pictures
		
	// set folderpath of fileUploadWidget
	$$('component_Main_upload_Pictures').setFolderName('Picture_Uploads/' + WAF.directory.currentUser().ID);
	
	$$('component_Main_Profile_Name').setValue(WAF.directory.currentUser().userName);
	$$('component_Main_Profile_email').setValue(sources.webuser.Email);
	$$('component_Main_Profile_Phone').setValue(sources.webuser.Phone);
	$$('component_Main_Profile_Date_of_Birth').setValue($.datepicker.formatDate('dd.mm.yy',sources.webuser.Date_of_Birth));	
	$('#component_Main_container_jqxMenu_Profile_Country').jqxComboBox({source: ['D','A','CH'], width: '60', height: '22px'});
	$('#component_Main_container_jqxMenu_Profile_Country').jqxComboBox('val',sources.webuser.Country_Code);
	$$('component_Main_Profile_Postal_Code').setValue(sources.webuser.Postal_Code);
	$$('component_Main_Profile_City').setValue(sources.webuser.City);
	webuser_address_modified_flag = false; // Modified flag webuser address
	$$('component_Main_checkbox_Profile_Videochat').setValue(sources.webuser.Videochat_Activated);
	
	// @region namespaceDeclaration// @startlock
	var Profile_City = {};	// @textField
	var Profile_Postal_Code = {};	// @textField
	var container_jqxMenu_Profile_Country = {};	// @container
	var checkbox_Profile_Videochat = {};	// @checkbox
	var button_Profile_Delete = {};	// @button
	var button_Deactivate_Save = {};	// @button
	var button_Picture_Main = {};	// @button
	var button_Pictures_Selected_Remove = {};	// @button
	var checkbox_Picture_Select_Remove = {};	// @checkbox
	var matrix_Pictures = {};	// @matrix
	var upload_Pictures = {};	// @fileUpload
	var button_Contact_Save = {};	// @button
	var button_Login_Save = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	Profile_City.change = function Profile_City_change (event)// @startlock
	{// @endlock
		webuser_address_modified_flag = true; // Modified flag webuser address
	};// @lock

	Profile_Postal_Code.change = function Profile_Postal_Code_change (event)// @startlock
	{// @endlock
		webuser_address_modified_flag = true; // Modified flag webuser address
	};// @lock

	container_jqxMenu_Profile_Country.click = function container_jqxMenu_Profile_Country_click (event)// @startlock
	{// @endlock
		webuser_address_modified_flag = true; // Modified flag webuser address
	};// @lock

	checkbox_Profile_Videochat.change = function checkbox_Profile_Videochat_change (event)// @startlock
	{// @endlock
		sources.webuser.Videochat_Activated = $$('component_Main_checkbox_Profile_Videochat').getValue();
		sources.webuser.save({
			onSuccess: function (event) {
			} // end onSuccess
		}); // end .save()
	};// @lock

	button_Profile_Delete.click = function button_Profile_Delete_click (event)// @startlock
	{// @endlock
		alertify.set({ labels: {
		    cancel     : gStr_Localized_Get('Confirm_Button_OK', locStr_User_Profile),
		    ok : gStr_Localized_Get('Confirm_Button_Cancel', locStr_User_Profile)
		}}); // end alertify.set
		alertify.confirm(gStr_Localized_Get('Confirm_Message_Removal', locStr_User_Profile), function (e) {
		    if (!e) { // user clicked "ok"
		       sources.webuser.User_Profile_Remove_by_User();
		       	WAF.directory.logout();
				location.reload(true); // reload to rebuild jqx menu
		    } // end if user clicked ok
		}); // end alertify.confirm
	};// @lock

	button_Deactivate_Save.click = function button_Deactivate_Save_click (event)// @startlock
	{// @endlock
		sources.webuser.Profile_Deactivated = !sources.webuser.Profile_Deactivated;
		sources.webuser.save({
			onSuccess: function (event) {
				$$($comp.id).Profile_Activated_Deactivated_Display();
			} // end onSuccess
		}); // end .save()
	};// @lock

	button_Picture_Main.click = function button_Picture_Main_click (event)// @startlock
	{// @endlock
		if (event.originalEvent) { // event from clicking in matrix
			sources.component_Main_user_Documents.Main_Picture_Set({
				onSuccess:function(event) {
					if(!event.result.error_text) { // uploaded without error text
						User_Documents_Load(); // load pictures
					}; // end if uploaded without error text
				},
				onError:function(error) {
					alert('OnError sources.component_Main_user_Documents.Main_Picture_Set');
				}
			}, sources.component_Main_user_Documents.ID); // end sources.webuser.On_Uploaded_Pictures			
		}; // event from clicking in matrix
	};// @lock

	button_Pictures_Selected_Remove.click = function button_Pictures_Selected_Remove_click (event)// @startlock
	{// @endlock
			sources.component_Main_user_Documents.Remove_Selected_Entities({
				onSuccess:function(event) {
					if(!event.result.error_text) { 
						User_Documents_Load(); // load pictures
					};
				},
				onError:function(error) {
					alert('OnError  sources.component_Main_user_Documents.Remove_Selected_Entities');
				}
			}); // end sources.component_Main_user_Documents.Remove_Selected_Entities
	};// @lock

	checkbox_Picture_Select_Remove.change = function checkbox_Picture_Select_Remove_change (event)// @startlock
	{// @endlock
		if (event.originalEvent) { // event from clicking in matrix
			var checkbox_true_false = $$(this.id).getValue();
			sources.component_Main_user_Documents.Selected_to_Remove = checkbox_true_false;
			sources.component_Main_user_Documents.save();
		}; // event from clicking in matrix
	};// @lock

	matrix_Pictures.onChildrenDraw = function matrix_Pictures_onChildrenDraw (event)// @startlock
	{// @endlock
		// localize checkbox Remove, button main picture
		var object_to_set = locObj_Comp;
		var language_to_set = sources.webuser.Preferences_Language_Shortcut;
		var DOM_ID = 'Checkbox_Picture_Select_Remove';
		$(object_to_set[language_to_set][DOM_ID].Selector).html(object_to_set[language_to_set][DOM_ID].Value);
		var DOM_ID = 'Checkbox_Picture_Main';
		$(object_to_set[language_to_set][DOM_ID].Selector).html(object_to_set[language_to_set][DOM_ID].Value);

		// set checkbox Remove
		// get cell identifier from #clone-component_Main_container1-0-0
		var cell_id = event.htmlObject.selector.substring(32);
		var checkbox_id = 'clone-component_Main_checkbox_Picture_Select_Remove' + cell_id;
		if ($$(checkbox_id)) { // checkox exists in DOM
			if (!event.source.Selected_to_Remove) { // not selected to remove
				$$(checkbox_id).setValue(false);
			} // end if not selected to remove
			else { // selected to remvove
				$$(checkbox_id).setValue(true);
			}; // end if checkox exists in DOM
			
			// remove button select main picture if picture is main picture
			if (event.source.Main_Picture) { // picture is main picture
				var button_id = 'clone-component_Main_button_Picture_Main' + cell_id;
				if ($$(button_id)) { // button exists in DOM
					$$(button_id).destroy();
				}; // button exists in DOM
			}; // picture is main picture
		}; // end if checkox exists in DOM
	};// @lock

	upload_Pictures.filesUploaded = function upload_Pictures_filesUploaded (event)// @startlock
	{// @endlock
		sources.webuser.On_Uploaded_Pictures({
			onSuccess:function(event) {
				if(!event.result.error_text) { // uploaded without error text
					User_Documents_Load(); // load pictures
				}; // end if uploaded without error text
			},
			onError:function(error) {
				alert('OnError sources.webuser.On_Uploaded_Pictures');
			}
		}); // end sources.webuser.On_Uploaded_Pictures
	};// @lock

	button_Contact_Save.click = function button_Contact_Save_click (event)// @startlock
	{// @endlock
		var ok_Flag = true;
		var id_Contact_email = getHtmlId('Profile_email');
		var val_login_email = $$(id_Contact_email).getValue();
		if(!val_login_email){
			alert(gStr_Localized_Get('No_email_entered', locStr_User_Profile));
			ok_Flag = false;
			$$(id_login_email).focus();
		};
		if(ok_Flag) {
			ok_Flag = (val_login_email.indexOf('@') > -1) && (val_login_email.indexOf('.') > -1);
			if(!ok_Flag){
				alert(gStr_Localized_Get('Invalid_email_format', locStr_User_Profile));
				ok_Flag = false;
				$$(id_Contact_email).focus();
			};
		}; // ok_Flag
		
		if(ok_Flag) {
			var Gender_Index = $('#component_Main_container_jqxMenu_Profile_Gender').jqxDropDownList('selectedIndex');
			ok_Flag = Gender_Index !== -1;
			if(!ok_Flag){
				alert(gStr_Localized_Get('No_gender_specified', locStr_User_Profile));
				ok_Flag = false;
			}; // end if !ok_Flag
		}; // ok_Flag
		
		if (ok_Flag) {
			var id_Profile_Date_of_Birth = getHtmlId('Profile_Date_of_Birth');
			var val_Profile_Date_of_Birth = $$(id_Profile_Date_of_Birth).getValue();
			ok_Flag = !!val_Profile_Date_of_Birth; 
			if (!ok_Flag) {
				alert(gStr_Localized_Get('No_Date_of_Birth_entered', locStr_User_Profile));
				$$('id_Profile_Date_of_Birth').focus();
			}; // end if !ok_Flag
		};
		if(ok_Flag) {
			val_Profile_Date_of_Birth = stringToDate_dd_mm_yy(val_Profile_Date_of_Birth);
			ok_Flag = !!val_Profile_Date_of_Birth; 
			if (!ok_Flag) {
				alert(gStr_Localized_Get('Invalid_Date_of_Birth', locStr_User_Profile));
				$$('id_Profile_Date_of_Birth').focus();
			}; // end if !ok_Flag 
		}; // end if ok_Flag
		if(ok_Flag) {
			var date_today = new Date();
			var date_limit_Age_18 = new Date();
			var date_limit_Age_100 = new Date();
			date_limit_Age_18.setTime(date_today.getTime() - (18*365*86400000));
			date_limit_Age_100.setTime(date_today.getTime() - (100*365*86400000));
			ok_Flag = (val_Profile_Date_of_Birth <= date_limit_Age_18) && (val_Profile_Date_of_Birth >= date_limit_Age_100);
			if (!ok_Flag) {
				alert(gStr_Localized_Get('Date_of_Birth_invalid_range', locStr_User_Profile));
				$$('id_Profile_Date_of_Birth').focus();
			}; // end if !ok_Flag 
		}; // end if ok_Flag

		if(ok_Flag) {
			var id_Contact_Phone = getHtmlId('Profile_Phone');
			var val_login_Phone = $$(id_Contact_Phone).getValue();
			var value_Profile_Country_Code = $('#component_Main_container_jqxMenu_Profile_Country').jqxComboBox('val');
			var id_Profile_Postal_Code = getHtmlId('Profile_Postal_Code');
			var value_Profile_Postal_Code = $$(id_Profile_Postal_Code).getValue();
			var id_Profile_City = getHtmlId('Profile_City');
			var value_Profile_City = $$(id_Profile_City).getValue();
			
			var objServer_Profile_Details = {}; // Profile details to be send to the server
			objServer_Profile_Details.Email = val_login_email;
			objServer_Profile_Details.Phone = val_login_Phone;
			objServer_Profile_Details.Gender = locStr_User_Profile.key.Array_Gender[Gender_Index];
			objServer_Profile_Details.Date_of_Birth = val_Profile_Date_of_Birth;
			objServer_Profile_Details.Country_Code = value_Profile_Country_Code;
			objServer_Profile_Details.Postal_Code = value_Profile_Postal_Code;
			objServer_Profile_Details.City = value_Profile_City;
			
			// get new geocordinates if address was changed from google
			// this should be done on the server
			if(webuser_address_modified_flag) { // oaddress was changed
				var geocoder = new google.maps.Geocoder();
				var address_string = value_Profile_Country_Code;
				if (address_string) address_string += '-';
				address_string += value_Profile_Postal_Code;
				if (value_Profile_City) {
					if (address_string) address_string += ' ';
					address_string += value_Profile_City;
				}; // end if value_Profile_City
				geocoder.geocode({address: address_string}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
					   // objServer_Profile_Details.google_location_obj = results[0].geometry.location;
						sources.webuser.User_Profile_Geocoordinates_Modify({
							onSuccess:function(event) {
							},
							onError:function(error) {
								alert('OnError sources.webuser.Modify_Contact_Details');
							}
						},results[0].geometry.location); // end sources.webuser.Modify_Contact_Details
			  		}; // end if status OK
				}); // goecoder.geocode
			}; // end if address was changed
		
			sources.webuser.Modify_Contact_Details({
				onSuccess:function(event) {
					if(!event.result.error_text) { 
						if (event.result.entity) sources.person.setCurrentEntity(event.result.entity); // Updated timestamp
						alert(gStr_Localized_Get('Contact_Personal_Data_saved_successfully', locStr_User_Profile));
						
						webuser_address_modified_flag = false; // Modified flag webuser address
					}
					else {
						alert(gStr_Localized_Get(event.result.error_text, locStr_User_Profile, null, event.result.error_params));
						$$(val_login_email).focus();
					};
				},
				onError:function(error) {
					alert('OnError sources.webuser.Modify_Contact_Details');
					console.log(error);
				}
			},objServer_Profile_Details); // end sources.webuser.Modify_Contact_Details
		}; // end if ok_Flag
	};// @lock

	button_Login_Save.click = function button_Login_Save_click (event)// @startlock
	{// @endlock
		var ok_Flag = true;
		var id_login_Name = getHtmlId('Profile_Name');
		var val_login_Name = $$(id_login_Name).getValue();
		if(!val_login_Name){
			alert(gStr_Localized_Get('No_name_entered', locStr_User_Profile));
			ok_Flag = false;
			$$(id_login_Name).focus();
		};
		if(ok_Flag) {
			if (val_login_Name === WAF.directory.currentUser().userName) { // Name not modified by user
				alert(gStr_Localized_Get('Name_not_edited', locStr_User_Profile));
				ok_Flag = false;
				$$(id_login_Name).focus();
			}; // end if Name not modified by user
		}; // ok_Flag
		if(ok_Flag) {
			var id_login_Password = getHtmlId('Profile_Password');
			var val_login_Password = $$(id_login_Password).getValue();
			if(!val_login_Password){
				alert(gStr_Localized_Get('No_password_entered', locStr_User_Profile));
				ok_Flag = false;
				$$(id_login_Password).focus();
			};
		}; // ok_Flag

		if(ok_Flag) {
			sources.webuser.Modify_Login_Details({
				onSuccess:function(event) {
					if(!event.result.error_text) { 
						$$('richText_User_Name').setValue(val_login_Name);
						alert(gStr_Localized_Get('Name_Password_saved_successfully', locStr_User_Profile));
					}
					else {
						alert(gStr_Localized_Get(event.result.error_text, locStr_User_Profile, null, event.result.error_params));
						$$(id_login_Name).focus();
					};
				},
				onError:function(error) {
					alert('OnError sources.webuser.Modify_Login_Details');
				}
			},val_login_Name,val_login_Password); // end sources.webuser.Modify_Username
		}; // end if ok_Flag
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_Profile_City", "change", Profile_City.change, "WAF");
	WAF.addListener(this.id + "_Profile_Postal_Code", "change", Profile_Postal_Code.change, "WAF");
	WAF.addListener(this.id + "_container_jqxMenu_Profile_Country", "click", container_jqxMenu_Profile_Country.click, "WAF");
	WAF.addListener(this.id + "_checkbox_Profile_Videochat", "change", checkbox_Profile_Videochat.change, "WAF");
	WAF.addListener(this.id + "_button_Profile_Delete", "click", button_Profile_Delete.click, "WAF");
	WAF.addListener(this.id + "_button_Deactivate_Save", "click", button_Deactivate_Save.click, "WAF");
	WAF.addListener(this.id + "_button_Picture_Main", "click", button_Picture_Main.click, "WAF");
	WAF.addListener(this.id + "_button_Pictures_Selected_Remove", "click", button_Pictures_Selected_Remove.click, "WAF");
	WAF.addListener(this.id + "_checkbox_Picture_Select_Remove", "change", checkbox_Picture_Select_Remove.change, "WAF");
	WAF.addListener(this.id + "_matrix_Pictures", "onChildrenDraw", matrix_Pictures.onChildrenDraw, "WAF");
	WAF.addListener(this.id + "_upload_Pictures", "filesUploaded", upload_Pictures.filesUploaded, "WAF");
	WAF.addListener(this.id + "_button_Contact_Save", "click", button_Contact_Save.click, "WAF");
	WAF.addListener(this.id + "_button_Login_Save", "click", button_Login_Save.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
