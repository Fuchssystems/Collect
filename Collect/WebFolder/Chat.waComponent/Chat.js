
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	Chat_Components_Init(); // Initilize Chat components
	
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
		for (var i = 0, len = Chat_Components.length; i < len; i++) {
			if ($$(Chat_Components[i].Component_id).localize) $$(Chat_Components[i].Component_id).localize(language_to_set);
		}; // end for
	}; // end this.localize
	
	this.unload = function() { // to be called on component.remove()
		if (ws) ws.close(1000); // close websocket connection
	}; // end this.unload()

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Chat';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		//WAF.PLATFORM.isTouch = false; // IE 10/11 bug
		
		widget_Drag_Parameters_Set(data.userData.prog_ID, id); // initialize draggable widget with saved positions
		widget_position_restore (data.userData.prog_ID, id); // move widgets to saved positions (after dragging)

		Pictures_in_Chat_Matrix_Webuser_ID = ''; // Webuser ID for which all pictures are displayed in matrix
	
		this.localize(); // localize DOM of from localization object
		
		Chatfilter_obj_Load(); // Load user preferences
		Chat_Load_Webusers(); // load other webuser from server in datasource		
	// @region namespaceDeclaration// @startlock
	var textField_Chatfilter_Distance = {};	// @textField
	var textField_Chatfilter_Age_Maximum = {};	// @textField
	var textField_Chatfilter_Age_Minimum = {};	// @textField
	var checkbox_Chatfilter_Unread_Messages = {};	// @checkbox
	var button_Chatfilter_Reset_All = {};	// @button
	var checkbox_Chatfilter_Online = {};	// @checkbox
	var checkbox_Chatfilter_Gender_Undetermined = {};	// @checkbox
	var checkbox_Chatfilter_Gender_Male = {};	// @checkbox
	var checkbox_Chatfilter_Gender_Female = {};	// @checkbox
	var checkbox_Chatfilter_Webcam = {};	// @checkbox
	var obj_ChatfilterEvent = {};	// @dataSource
	var button_Chat_Filter_close = {};	// @button
	var button_Chat_Filter_Dialog = {};	// @button
	var button_Videochat_Decline = {};	// @button
	var button_Videochat_Accept = {};	// @button
	var button_Videochat_Call = {};	// @button
	var button_Videochat_Terminate = {};	// @button
	var button_Videochat_close = {};	// @button
	var image_Webcam = {};	// @image
	var image_Gender = {};	// @image
	var image_Unread_Messages = {};	// @image
	var matrix_Webusers = {};	// @matrix
	var image_Picture_Main = {};	// @image
	// @endregion// @endlock

	// eventHandlers// @lock

	textField_Chatfilter_Distance.blur = function textField_Chatfilter_Distance_blur (event)// @startlock
	{// @endlock
		var value_Distance = $$('component_Main_textField_Chatfilter_Distance').getValue();
		if (value_Distance || component_Main_obj_Chatfilter.Distance) { // value changed
			var OK_Flag = !!value_Distance;
			if (OK_Flag) { // field has value
				var integer_Distance = parseInt(value_Distance);
				var OK_Flag = integer_Distance >= 1 && integer_Distance <=1000;
				if (!OK_Flag) {
					alert(gStr_Localized_Get('Chatfilter_Distance_Range', locStr_Char));
					$$('component_Main_textField_Chatfilter_Distance').focus();
				};
			}; // end if field has value
			if (OK_Flag) {
				component_Main_obj_Chatfilter.Distance = integer_Distance;
				$$('component_Main_textField_Chatfilter_Distance').setValue(integer_Distance);
			} // end if OK_Flag
			else { // !OK_Flag
				component_Main_obj_Chatfilter.Distance = '';
				$$('component_Main_textField_Chatfilter_Distance').setValue('');
			}; // end else !OK_Flag
			Chatfilter_Query(component_Main_obj_Chatfilter);
		}; // end if value changed
	};// @lock

	textField_Chatfilter_Age_Maximum.blur = function textField_Chatfilter_Age_Maximum_blur (event)// @startlock
	{// @endlock
		var value_max = $$('component_Main_textField_Chatfilter_Age_Maximum').getValue();
		if (value_max || component_Main_obj_Chatfilter.Age_Years_Maximum) { // value changed
			var OK_Flag = !!value_max;
			if (OK_Flag) { // field has value
				var age_max = parseInt(value_max);
				var OK_Flag = age_max >= 18 && age_max <=99;
				if (!OK_Flag) {
					alert(gStr_Localized_Get('Chatfilter_Max_Age_Range', locStr_Char));
				};
				if (OK_Flag) {
					var value_min = $$('component_Main_textField_Chatfilter_Age_Minimum').getValue();
					var age_min = parseInt(value_min);
					if (age_min) { // minimum age defined
						var OK_Flag = age_max >= age_min;
							if (!OK_Flag) {
								alert(gStr_Localized_Get('Chatfilter_Max_Age_be_smaller_than_Min', locStr_Char));
								$$('component_Main_textField_Chatfilter_Age_Maximum').focus();
							};
					}; // end if minimum age defined
				}; // end if OK_Flag
			}; // end if field has value
			if (OK_Flag) {
				component_Main_obj_Chatfilter.Age_Years_Maximum = age_max;
				$$('component_Main_textField_Chatfilter_Age_Maximum').setValue(age_max);
			} // end if OK_Flag
			else { // !OK_Flag
				component_Main_obj_Chatfilter.Age_Years_Maximum = '';
				$$('component_Main_textField_Chatfilter_Age_Maximum').setValue('');
			}; // end else !OK_Flag
			Chatfilter_Query(component_Main_obj_Chatfilter);
		}; // end if value changed
	};// @lock

	textField_Chatfilter_Age_Minimum.blur = function textField_Chatfilter_Age_Minimum_blur (event)// @startlock
	{// @endlock
		var value_min = $$('component_Main_textField_Chatfilter_Age_Minimum').getValue();
		if (value_min !== component_Main_obj_Chatfilter.Age_Years_Minimum) { // value changed
			var OK_Flag = !! value_min;
			if (OK_Flag) { // field has value
				var age_min = parseInt(value_min);
				var OK_Flag = age_min >= 18 && age_min <=80;
				if (!OK_Flag) {
					alert(gStr_Localized_Get('Chatfilter_Min_Age_Range', locStr_Char));
				};
				if (OK_Flag) {
					var value_max = $$('component_Main_textField_Chatfilter_Age_Maximum').getValue();
					var age_max = parseInt(value_max);
					if (age_max) { // Maximum age defined
						var OK_Flag = age_max >= age_min;
							if (!OK_Flag) {
								alert(gStr_Localized_Get('Chatfilter_Max_Age_be_smaller_than_Min', locStr_Char));
								$$('component_Main_textField_Chatfilter_Age_Minimum').focus();
							};
					}; // end if maximum age defined
				}; // end if OK_Flag
			}; // end if field has value
			if (OK_Flag) {
				component_Main_obj_Chatfilter.Age_Years_Minimum = age_min;
				$$('component_Main_textField_Chatfilter_Age_Minimum').setValue(age_min);
			} // end if OK_Flag
			else { // !OK_Flag
				component_Main_obj_Chatfilter.Age_Years_Minimum = '';
				$$('component_Main_textField_Chatfilter_Age_Minimum').setValue('');
			}; // end else !OK_Flag
			Chatfilter_Query(component_Main_obj_Chatfilter);
		}; // end if value changed
	};// @lock

	checkbox_Chatfilter_Unread_Messages.change = function checkbox_Chatfilter_Unread_Messages_change (event)// @startlock
	{// @endlock
		Chatfilter_Query(component_Main_obj_Chatfilter);		
	};// @lock

	button_Chatfilter_Reset_All.click = function button_Chatfilter_Reset_All_click (event)// @startlock
	{// @endlock
		Chatfilter_obj_Init(); // reset Filer
		Chatfilter_UI_Elements_Set(); // set filter user interface widgets
		Chatfilter_Query(component_Main_obj_Chatfilter);
	};// @lock

	checkbox_Chatfilter_Online.change = function checkbox_Chatfilter_Online_change (event)// @startlock
	{// @endlock
		Chatfilter_Query(component_Main_obj_Chatfilter);
	};// @lock

	checkbox_Chatfilter_Gender_Undetermined.change = function checkbox_Chatfilter_Gender_Undetermined_change (event)// @startlock
	{// @endlock
		Chatfilter_Query(component_Main_obj_Chatfilter);
	};// @lock

	checkbox_Chatfilter_Gender_Male.change = function checkbox_Chatfilter_Gender_Male_change (event)// @startlock
	{// @endlock
		Chatfilter_Query(component_Main_obj_Chatfilter);
	};// @lock

	checkbox_Chatfilter_Gender_Female.change = function checkbox_Chatfilter_Gender_Female_change (event)// @startlock
	{// @endlock
		Chatfilter_Query(component_Main_obj_Chatfilter);
	};// @lock

	checkbox_Chatfilter_Webcam.change = function checkbox_Chatfilter_Webcam_change (event)// @startlock
	{// @endlock
		Chatfilter_Query(component_Main_obj_Chatfilter);
	};// @lock

	obj_ChatfilterEvent.onNew_MessagesAttributeChange = function obj_ChatfilterEvent_onNew_MessagesAttributeChange (event)// @startlock
	{// @endlock
		// object attribute does not exist
	};// @lock

	button_Chat_Filter_close.click = function button_Chat_Filter_close_click (event)// @startlock
	{// @endlock
		$$('component_Main_container_Chat_Filter').hide();
	};// @lock

	button_Chat_Filter_Dialog.click = function button_Chat_Filter_Dialog_click (event)// @startlock
	{// @endlock
		$$('component_Main_container_Chat_Filter').show();
	};// @lock

	button_Videochat_Decline.click = function button_Videochat_Decline_click (event)// @startlock
	{// @endlock
		Videochat_Decline_Call();
	};// @lock

	button_Videochat_Accept.click = function button_Videochat_Accept_click (event)// @startlock
	{// @endlock
		Videochat_Accept_Call_Main();
	};// @lock

	button_Videochat_Call.click = function button_Videochat_Call_click (event)// @startlock
	{// @endlock
		Videochat_Call_Main();
	};// @lock

	button_Videochat_Terminate.click = function button_Videochat_Terminate_click (event)// @startlock
	{// @endlock
		Videochat_Window_Close();
	};// @lock

	button_Videochat_close.click = function button_Videochat_close_click (event)// @startlock
	{// @endlock
		Videochat_Window_Close();
	};// @lock

	image_Webcam.click = function image_Webcam_click (event)// @startlock
	{// @endlock
		Chatpartner_Clicked(event);
	};// @lock

	image_Gender.click = function image_Gender_click (event)// @startlock
	{// @endlock
		Chatpartner_Clicked(event);
	};// @lock

	image_Unread_Messages.click = function image_Unread_Messages_click (event)// @startlock
	{// @endlock
		Chatpartner_Clicked(event);
	};// @lock

	matrix_Webusers.onChildrenDraw = function matrix_Webusers_onChildrenDraw (event)// @startlock
	{// @endlock
		if(event.source.Is_Online_Calculated) { // Webuser is online
			event.htmlObject.css("border", "solid #903 3px");
		}; // end if Webuser is online
		var cell_id = event.htmlObject.selector.substring(39);		
		var richText_id = 'clone-component_Main_Other_Users_Online' + cell_id;
		if ($$(richText_id)) { // richText Online exists
			arr_other_Webusers_Online_Status.push({}); // array other webuser online status
			var index = arr_other_Webusers_Online_Status.length - 1;
			arr_other_Webusers_Online_Status[index].Webuser_ID = event.source.Directory_ID;
			arr_other_Webusers_Online_Status[index].richText_Status_ID = richText_id;
			arr_other_Webusers_Online_Status[index].Status = !!event.source.Is_Online_Calculated;
			if (event.source.Is_Online_Calculated) { // Webuser is online			
				$$(richText_id).setValue(gStr_Localized_Get('Other_User_is_online', locStr_Char));
				$$(richText_id).addClass('Online_Status_true');
			} // end if Webuser is online
			else { // Webuser offline
				$$(richText_id).setValue('');
				$$(richText_id).removeClass('Online_Status_true');
			}; // end if Webuser is online
			
			// status unread messages
			var image_id = 'clone-component_Main_image_Unread_Messages' + cell_id;
			arr_other_Webusers_Online_Status[index].has_Unread_Messages = !!event.source.Unread_Messages_Calculated;
			arr_other_Webusers_Online_Status[index].image_id_has_Unread_Messages = image_id;
			if (event.source.Unread_Messages_Calculated) { // Webuser has unread messages		
				$$(image_id).show();
			} // end if Webuser has unread messages
			else { // Webuser has no unread messages
				$$(image_id).hide('visibility');
			}; // end if Webuser has no unread messages
			
			// gender image
			var image_id = 'clone-component_Main_image_Gender' + cell_id;
			switch (event.source.Gender) {
				case 'male':
					$$(image_id).setValue('images/001_55.png');
					break;
				case 'female':
					$$(image_id).setValue('images/001_56.png');
					break;	
				default:
					$$(image_id).setValue('images/001_54.png');
			}; // end switch
			
			// webcam image
			var image_id = 'clone-component_Main_image_Webcam' + cell_id;
			arr_other_Webusers_Online_Status[index].Videochat_Activated = !!event.source.Videochat_Activated;
			if (event.source.Videochat_Activated) { // Webuser has Videochat activated		
				$$(image_id).show();
			} // end if Webuser has unread messages
			else { // Webuser Webuser not has Videochat activated
				$$(image_id).hide('visibility');
			}; // end if Webuser has Videochat activated
		}; // end if richText Online exists
	};// @lock

	image_Picture_Main.click = function image_Picture_Main_click (event)// @startlock
	{// @endlock
		Chatpartner_Clicked(event);
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_textField_Chatfilter_Distance", "blur", textField_Chatfilter_Distance.blur, "WAF");
	WAF.addListener(this.id + "_textField_Chatfilter_Age_Maximum", "blur", textField_Chatfilter_Age_Maximum.blur, "WAF");
	WAF.addListener(this.id + "_textField_Chatfilter_Age_Minimum", "blur", textField_Chatfilter_Age_Minimum.blur, "WAF");
	WAF.addListener(this.id + "_checkbox_Chatfilter_Unread_Messages", "change", checkbox_Chatfilter_Unread_Messages.change, "WAF");
	WAF.addListener(this.id + "_button_Chatfilter_Reset_All", "click", button_Chatfilter_Reset_All.click, "WAF");
	WAF.addListener(this.id + "_checkbox_Chatfilter_Online", "change", checkbox_Chatfilter_Online.change, "WAF");
	WAF.addListener(this.id + "_checkbox_Chatfilter_Gender_Undetermined", "change", checkbox_Chatfilter_Gender_Undetermined.change, "WAF");
	WAF.addListener(this.id + "_checkbox_Chatfilter_Gender_Male", "change", checkbox_Chatfilter_Gender_Male.change, "WAF");
	WAF.addListener(this.id + "_checkbox_Chatfilter_Gender_Female", "change", checkbox_Chatfilter_Gender_Female.change, "WAF");
	WAF.addListener(this.id + "_checkbox_Chatfilter_Webcam", "change", checkbox_Chatfilter_Webcam.change, "WAF");
	WAF.addListener(this.id + "_obj_Chatfilter", "onNew_MessagesAttributeChange", obj_ChatfilterEvent.onNew_MessagesAttributeChange, "WAF", "New_Messages");
	WAF.addListener(this.id + "_button_Chat_Filter_close", "click", button_Chat_Filter_close.click, "WAF");
	WAF.addListener(this.id + "_button_Chat_Filter_Dialog", "click", button_Chat_Filter_Dialog.click, "WAF");
	WAF.addListener(this.id + "_button_Videochat_Decline", "click", button_Videochat_Decline.click, "WAF");
	WAF.addListener(this.id + "_button_Videochat_Accept", "click", button_Videochat_Accept.click, "WAF");
	WAF.addListener(this.id + "_button_Videochat_Call", "click", button_Videochat_Call.click, "WAF");
	WAF.addListener(this.id + "_button_Videochat_Terminate", "click", button_Videochat_Terminate.click, "WAF");
	WAF.addListener(this.id + "_button_Videochat_close", "click", button_Videochat_close.click, "WAF");
	WAF.addListener(this.id + "_image_Webcam", "click", image_Webcam.click, "WAF");
	WAF.addListener(this.id + "_image_Gender", "click", image_Gender.click, "WAF");
	WAF.addListener(this.id + "_image_Unread_Messages", "click", image_Unread_Messages.click, "WAF");
	WAF.addListener(this.id + "_matrix_Webusers", "onChildrenDraw", matrix_Webusers.onChildrenDraw, "WAF");
	WAF.addListener(this.id + "_image_Picture_Main", "click", image_Picture_Main.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
