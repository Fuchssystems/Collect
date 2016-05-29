// user function generic to all solutions

// return best language shortcut application supports
var app_Language_Best = function () {
	var best_language = app_Languages.application_default ; // application default language;
	if (navigator.language) { // browser language defined
		// use the best suported language for browser language shortcut (only 1st two characters)
		var index = app_Languages.supported.indexOf (navigator.language.substring(0,2));
		if (index !== -1) { // language is supported
			best_language = app_Languages.supported[index];
		} // language is supported
	}; // browser language defined
	return best_language;
}; //

// main function main-menu item selected
var menu_main_item_onSelect = function (id) {
	var logged_in_Flag = !!WAF.directory.currentUser();
	// check if current status of logged in Webuser allows opening of program id
	var User_Status_Allows_Access = check_current_User_status_for_access_for_program_id(id,logged_in_Flag);
	
	if (User_Status_Allows_Access) { // current status of user allows access
		var ok_to_load_Flag = !progPara[id].Logged_In_Only; // flag must be logged on to use program or not
		if (!ok_to_load_Flag) ok_to_load_Flag = logged_in_Flag;
		if (!ok_to_load_Flag) { // no user logged in and must be logged in
			// Display Log In Dialog
			$$('component_Userlogin').loadComponent({
				path: '/Userlogin.waComponent',
				userData: {program_ID_after_login: id}
			}); // end .loadComponent
		} // end if no user logged in and must be logged in
		else { // user logged in or not no login required
			prog_Main_Select (id,true) // select main component, save user preferences
		}; // end else user logged in or not no login required
	}; // end if current status of user allows access
}; // end var menu_main_item_onSelect

// select main program by menu or link
var prog_Main_Select = function(prog_ID_to_select, save_User_preferences_Flag, push_history_Flag) {
	switch (progPara[prog_ID_to_select].kind) {
		case ('Component_Main'):
			if (typeof(push_history_Flag) === 'undefined') push_history_Flag = true;
			prog_ID_Current = prog_ID_to_select; // current program part ID (Welcome, FAQ,...)
			if ($$('component_Main').unload) $$('component_Main').unload(); // unload code
			$$('component_Main').removeComponent();
			if (prog_ID_to_select && progPara[prog_ID_to_select].Component_Name) { // program with component to load
				var componentPath = '/' + progPara[prog_ID_to_select].Component_Name;
				componentPath += '.waComponent';
				$$('component_Main').loadComponent({
					path: componentPath,
					// userData: {textFlow_1_contentName: contentName, source_0_Indexes_to_select: source_0_Index_to_select},
					userData: {prog_ID: prog_ID_Current, textFlow_1_contentName: progPara[prog_ID_to_select].Component_Content},
					onSuccess: function(event){
						console.log('onSuccess .loadComponent');
						// $$('component_Main').ready();} // remove all program key=value parameters from browser URL
					}
				}); // end .loadComponent()
			}; // program with component to load
			
			window_title_set(); // set window title
			// push browser history entry
			if (push_history_Flag && prog_ID_to_select && sources.webuser.Directory_ID) { // push mode and program selected and valid webuser entity that was created on server
				var stateObj = {user_Directory_ID: sources.webuser.Directory_ID, prog_ID: prog_ID_to_select};
				history.pushState(stateObj, '', '');
			}; // push mode and program selected and valid webuser entity that was created on server
			
			if (save_User_preferences_Flag) {
				sources.webuser.Program_ID_Last_Used = prog_ID_to_select; //
				if (sources.webuser.Directory_ID) { // valid webuser entity that was created on server
					sources.webuser.save({
						overrideStamp: true,
						onSuccess:function(event) {
							console.log('OnSuccess sources.webuser.Preferences_Save');
						},
						onError:function(error) {
							alert('OnError sources.webuser.Preferences_Save');
						}
					}); // end sources.webuser.save()
				}; // valid webuser entity that was created on server
			}; // end if save_User_preferences_Flag
			break;
		
		case ('Floating_Window_Main'):
			progPara[prog_ID_to_select].Dialog_Display();
			break;
	
	}; // end swich prog_ID_to_select.kind
}; // end var prog_Main_Select

// main function to set language
var language_Set_Main = function (language_to_set, save_User_preferences_Flag, initialize_Flag) {
	if (typeof(save_User_preferences_Flag) === 'undefined') save_User_preferences_Flag = true; // Flag save user preferences
	if (typeof(initialize_Flag) === 'undefined') initialize_Flag = false; // Flag save user preferences
	if (!language_to_set) language_to_set = sources.webuser.Preferences_Language_Shortcut;
	if (!language_to_set) language_to_set = app_Languages.default_shortcut;

	var logged_in_Flag = WAF.directory.currentUser();
	if (!logged_in_Flag) { // no user logged in
		$$('richText_User_Name').setValue(locObj_LogInOut[language_to_set].Username_Logged_Out);
		$$('button_Log_In_Out').setValue(locObj_LogInOut[language_to_set].Login); // button log in/out
		$$('button_Register').enable();
	} else { // a user is logged in
		$$('richText_User_Name').setValue(WAF.directory.currentUser().userName);
		$$('button_Log_In_Out').setValue(locObj_LogInOut[language_to_set].Logout); // button log in/out
		$$('button_Register').disable();
		
		if (save_User_preferences_Flag) { // save user preferences
			if (sources.webuser.Preferences_Language_Shortcut !== language_to_set) { // user language changed
				sources.webuser.Preferences_Language_Shortcut = language_to_set; // not asynchronus to avoid multiple savings
				if (sources.webuser.Directory_ID) { // valid webuser entity that was created on server
					sources.webuser.save({
						onSuccess:function(event) {
							console.log('OnSuccess sources.webuser.Preferences_Save');
						},
						onError:function(error) {
							alert('OnError sources.webuser.Preferences_Save');
						}
					}); // end sources.webuser.Preferences_Save()
				}; // valid webuser entity that was created on server
			}; // end if user language changed
		}; // end if save user preferences
	}; // no user logged in
	
	// localize components
	var comp_Main_Config = $$('component_Main').config;
	if (comp_Main_Config['data-path']) { // component loaded
		if ($$('component_Main').localize) { // component has function .localize()
			$$('component_Main').localize(language_to_set);
		}; // end if component has function .localize()
	}; // end if component loaded
	
	app_Languages.current_set = language_to_set; // current language set
		
	language_Set_DOM_from_Object(language_to_set, locObj_Main); // set DOM of index.html from localization object	
	window_title_set(); // set window title
}; // end var language_Set_Main

// make DOM object for jqx menu for main menu
var menu_Set_Main = function () {
	var menu_UL_HTML = '<ul id=jqxMenu_Main_UL>'; // HTML for jqx menu data
	var id = ''; // program ID
	var label = ' '; // menu label
	var paraString = ''; // parameter string
	var User_has_rights = false;
	for (var i = 0; i < menu_Main_Master.length; i++) {
		User_has_rights = menu_Main_Master[i].Group !== 'deactivated';
		if (User_has_rights) User_has_rights = (menu_Main_Master[i].Group !== 'Admin' || WAF_directory_currentUser_Belongs_to_Admin_Webuser);
		if (User_has_rights) { // user has privileges for item
			id = menu_Main_Master[i].id;
			if (!menu_Main_Master[i].items) { // not sub menu
				if (progPara[id]) {
					paraString = '\'' + id + '\'';
					menu_UL_HTML += '<li><a id=' + id + ' href=\"javascript:menu_main_item_onSelect(' + paraString + ')\">' + label + '</a></li>';
				}; // end if progPara[id]
			} // end if not submenu
			else { // submenu
				menu_UL_HTML += '<li><a id=' + id + '>' + label + '</a>';
				menu_UL_HTML += '<ul>';
				for (var k = 0; k < menu_Main_Master[i].items.length; k++) {
					User_has_rights = menu_Main_Master[i].items[k].Group !== 'deactivated';
					if (User_has_rights) User_has_rights = (menu_Main_Master[i].items[k].Group !== 'Admin' || WAF_directory_currentUser_Belongs_to_Admin_Webuser);
					if (User_has_rights) { // user has privileges for item
						id = menu_Main_Master[i].items[k].id;
						if (id !== 'separator') { // not separator line
							paraString = '\'' + id + '\'';
							menu_UL_HTML += '<li><a id=' + id + ' href=\"javascript:menu_main_item_onSelect(' + paraString + ')\">' + label + '</a></li>';
						} // end if not separator line
						else { // separator line
							menu_UL_HTML += '<li type=\'separator\'></li>';
						}; // end else separator line
					}; // end if user has privileges for item
				}; // end for k
				menu_UL_HTML += '</ul></li>';
			}; // end else submenu
		}; // end if user has privileges for item
	}; // end for i
	menu_UL_HTML += '</ul>';
	
	$('#jqxMenu_Main').append(menu_UL_HTML);
	var height = $$('container_Menu_Main').getHeight();
	var width = $$('container_Menu_Main').getWidth();			
	$("#jqxMenu_Main").jqxMenu({width: width, height: height, showTopLevelArrows: true});
	$("#jqxMenu_Main").css('visibility', 'visible');
}; // end var main_Menu_jqx_DOM_Obj_Make

// Main function setup menus
// to be replaced
var old_menu_Set_Main = function (language_to_set, logged_in_Flag, initialize_Flag) {
	// built menu bar with items to be displayed from master array
	menu_Main_Display = [];
	if (logged_in_Flag) {
		var e = -1; // new element number menu_Main_Display
		if (waf.directory.currentUserBelongsTo('Admin')) user_Groupname = 'Admin';
		for (var i = 0; i < menu_Main_Master.length; i++) {
			if (menu_Main_Master[i].Group === 'All' || menu_Main_Master[i].Group === user_Groupname) { // user has rights for item
				e = menu_Main_Display.length; // new element number menu_Main_Display
				menu_Main_Display[e] = {};
				menu_Main_Display[e].id = menu_Main_Master[i].id;
				menu_Main_Display[e].label = menu_Main_Master[i].label[language_to_set];
			}; // end if user has rights for item
		}; // end for 
	}; // end if logged_in_Flag
	
	if (initialize_Flag) { // initialize jqx menu
		var height = $$('container_Menu_Main').getHeight();
		var width = $$('container_Menu_Main').getWidth();		
		$("#jqxMenu_Main").jqxMenu({source: menu_Main_Display, width: width, height: height, showTopLevelArrows: true});
	} // end if initialize jqx menu
	else { // jqx menu already initialized
		$("#jqxMenu_Main").jqxMenu({source: menu_Main_Display});
	}; // end if // jqx menu already initialized
	if (initialize_Flag) { // initialize jqx menu
		$("#jqxMenu_Main").css('visibility', 'visible');
		$('#jqxMenu_Main').on('itemclick', function (event) {
			var id = event.args.id;
		    if (progPara[id]) { // valid program id
		    	prog_Main_Select (id,true); // select main component, save user preferences
			}; // end if valid program id
		});
	}; // end if // jqx menu already initialized
}; // end var menu_Set_Main

// Main function button Log In / Out
var user_LogInOut_Main = function () {
	if (!WAF.directory.currentUser()) { // no user logged in
		// Display Log In Dialog
		$$('component_Userlogin').setHeight(150);
		$$('component_Userlogin').loadComponent('/Userlogin.waComponent');
	} else { // a user is logged in or timed out session
		WAF.directory.logout();
		location.reload(true); // reload to rebuild jqx menu
	}; // no user logged in
}; // end var user_LogInOut_Main

// Main function button Register
var user_Register_Main = function () {
	if (WAF.directory.currentUser()) { // user still logged in
		WAF.directory.logout();
		WAF_directory_currentUser = null; // cached current user in directory
		WAF_directory_currentUser_Belongs_to_Admin_Webuser = false; // Current user is in group Admin_Webuser Flag
	}; // end if user still logged in
	// Display Register Dialog
	$$('component_Userlogin').setHeight(220);
	$$('component_Userlogin').loadComponent('/User_Register.waComponent');
}; // end var Register

// set language strings in DOM for localization object
var language_Set_DOM_from_Object = function (language_to_set, object_to_set, component_id) {
	if (!language_to_set) language_to_set = sources.webuser.Preferences_Language_Shortcut;
	if (!language_to_set) language_to_set = app_Languages.default_shortcut;
	if (object_to_set) { // object with DOM Ids passed
		if (component_id) { // optional component id passed
			component_id += '_';
		} // end optional component id passed
		else { // no component id passed
			component_id = '';
		}; // end if optional component id passed
		for (DOM_ID in object_to_set[language_to_set]) {
			if (!object_to_set[language_to_set][DOM_ID].Selector) { // property is selector
				if (!$$(component_id + DOM_ID)) { // not a wakanda widget
					// replace text outside span tags
					$('#' + component_id + DOM_ID).contents().filter(function() { return this.nodeType == 3; }).replaceWith(object_to_set[language_to_set][DOM_ID]);
				} // end if not a wakanda widget
				else { // a wakanda widget
					$('#' + component_id + DOM_ID).html(object_to_set[language_to_set][DOM_ID]);
				}; // end else a wakanda widget		
			} // end property is selector
			else { // selector specified
				$(object_to_set[language_to_set][DOM_ID].Selector).html(object_to_set[language_to_set][DOM_ID].Value);
			}; // end else selector specified
		}; // end for
	}; // end if object with DOM Ids passed
}; // end var language_Set_DOM_from_Object

// get loccalized string from string object with idenditfier - generic to all solutions
// substition placeholders %1, %2,...%9 can be passed in array or be padded at identifier (identifierstring%1discount%2value)
var gStr_Localized_Get = function (identifier, localization_Object, language_to_get, substitution_Arr) {
	var return_string = '';
	if (!language_to_get) language_to_get = sources.webuser.Preferences_Language_Shortcut;
	if (!language_to_get) language_to_get = app_Languages.current_set;	
	if (!language_to_get) language_to_get = app_Languages.default_shortcut;
	
	if (!substitution_Arr) { // no placeholder substitution array passed
		var placeholder_index_1st = identifier.indexOf('%');
		if(placeholder_index_1st !== -1) { // substitionen data padded
			substitution_Arr = [];
			var placeholder_index_previous = placeholder_index_1st;
			for (var i = placeholder_index_1st + 1, len = identifier.length; i < len; i++) {
				if (identifier[i] == '%') {
					substitution_Arr.push (identifier.substring(placeholder_index_previous+1,i));
					placeholder_index_previous = i;
				}; // end if
			}; // end for
			substitution_Arr.push (identifier.substring(placeholder_index_previous+1));
			identifier = identifier.substring(0,placeholder_index_1st);
		}; // end if substitionen data padded
	}; // end if no placeholder substitution array passed
		
	if (localization_Object[language_to_get][identifier]) { // identifier exists in localization object
		return_string = localization_Object[language_to_get][identifier];
		if (substitution_Arr) { // substition string for placeholders %1 %2 exists
			// substitute placeholders %1 - %9 with substition values passed in array
			for (var i = 0, len = substitution_Arr.length; i < len; i++) {
				return_string = return_string.replace('%' + (i+1), substitution_Arr[i]);
			}; // end for
	    }; // substition string for placeholders exists
    } // end if identifier exists in localization object
    else { // identifier does not exist in localization object
    	return_string = identifier;
    }; // end else identifier does not exist in localization object
    
	return return_string;
}; // end var gStr_Localized_Get

// set window title
var window_title_set = function () {
	var language_to_set = sources.webuser.Preferences_Language_Shortcut;
	if (!language_to_set) language_to_set = app_Languages.current_set;
	if (!language_to_set) language_to_set = app_Languages.default_shortcut;
	var window_title = '';
	if (prog_ID_Current) { // in a program part
		window_title = progPara[window.prog_ID_Current].language[language_to_set].window_Title_Main + ' - '
	}; // in a program part
	window_title += app_Name;
	document.title = window_title;
}; // end var window_title_set

// return document cookie
var cookie_read = function (cookie_name) {
	cookie_name += '=';
	var cookie_array = document.cookie.split(';');
	var cookie_element = '';
	for (var i=0; i<cookie_array.length; i++) {
		  cookie_element = cookie_array[i].trim();
		  if (cookie_element.indexOf(cookie_name)==0) return cookie_element.substring(cookie_name.length,cookie_element.length);
	}; // end for
	return '';
}; // end var cookie_read

// return date from string in format dd.mm.yy (or yyyy)
var stringToDate_dd_mm_yy = function (datestring) {
	var returnvalue = null;
	var arrElements = datestring.split('.');
	var OK_Flag = arrElements.length === 3;
	if (OK_Flag) {
		OK_Flag = false;
		if (arrElements[0].length >= 1 || arrElements[0].length <= 2) { // day has 1 or 2 chars
			var day = parseInt(arrElements[0]);
			OK_Flag = day >= 1 && day <= 31;
		}; // day has 1 or 2 chars
	}; // end if OK_Flag
	if (OK_Flag){
		OK_Flag = false;
		if (arrElements[1].length >= 1 || arrElements[1].length <= 2) { // month has 1 or 2 chars
			var month = parseInt(arrElements[1]);
			OK_Flag = month >= 1 && month <= 12;
		}; // month has 1-2 chars
	}; // end if OK_Flag
	if (OK_Flag){
		OK_Flag = false;
		if (arrElements[2].length === 2 || arrElements[2].length === 4) { // year has 2 or 4 chars
			var year = parseInt(arrElements[2]);
			if (arrElements[2].length === 2) year += 2000;
			OK_Flag = year >= 1900 && year <= 2100;
		}; // year has 2 or 4 chars
	}; // end if OK_Flag
	if (OK_Flag){
		returnvalue = new Date(year, month-1, day);
	}; // end if OK_Flag
	
	return returnvalue;
}; // end var stringToDate_dd_mm_yy

// get time string HH:MM from UTC Time/Date string
var timestring_from_UTC_HH_MM = function (UTC_Date_Time_String) {
	// example input: "2014-08-29T19:57:24.912Z"
	return UTC_Date_Time_String.substr(11,5);
}; // end var timestring_from_UTC_HH_MM

// set widget drag parameters
var widget_Drag_Parameters_Set = function (program_ID, component_ID) {
	if (!widget_Pos_Saved) widget_Pos_Saved_Initialize();
	var obj = widget_Pos_Saved[program_ID]; // object with widget names that are saved
	var widget_ID_Base = '#';
	if (component_ID) widget_ID_Base += component_ID + '_';
	var widget_ID_Complete = '';
	if (obj) {
		for (var item in obj) {
			// make widgets draggable and assign on drag stop function
			widget_ID_Complete = widget_ID_Base + item;
			$(widget_ID_Complete).draggable();
			$(widget_ID_Complete).on('dragstop', {program_ID: program_ID, widget_ID: item}, widget_on_Drag_End_Save_Position);
		}; // end for
	}; // end if obj
}; // end var widget_Drag_Parameters_Set

// widget on drag drag end save postion
var widget_on_Drag_End_Save_Position = function (event, ui) {
	var widget_id = ui.helper[0].id.substring(15);
	if (!widget_Pos_Saved) widget_Pos_Saved_Initialize();
	widget_Pos_Saved[event.data.program_ID][event.data.widget_ID].top = ui.position.top;
	widget_Pos_Saved[event.data.program_ID][event.data.widget_ID].left = ui.position.left;
	// save object with positions in User Preferences on server
	if (sources.webuser.Directory_ID) { // valid webuser entity that was created on server
		sources.webuser.Widget_Positions_JSON = JSON.stringify (widget_Pos_Saved);
		sources.webuser.save({
			onSuccess:function(event) {
				console.log('OnSuccess sources.webuser.Preferences_Save');
			},
			onError:function(error) {
				alert('OnError sources.webuser.Preferences_Save');
			}
		}); // end sources.webuser.Preferences_Save()
	}; // valid webuser entity that was created on server
}; // end var widget_Drag_End_Save_Position

// move widgets to saved positions (after dragging)
var widget_position_restore = function (program_ID, component_ID) {
	if (!widget_Pos_Saved) widget_Pos_Saved_Initialize();
	var obj = widget_Pos_Saved[program_ID]; // object with widget names that are saved
	var widget_ID_Base = '#';
	if (component_ID) widget_ID_Base += component_ID + '_';
	var widget_ID_Complete = '';
	if (obj) {
		for (var item in obj) {
			if (obj[item].top !== -1000 || obj[item].left !== -1000) { // custom widget postion
				widget_ID_Complete = widget_ID_Base + item;
				$(widget_ID_Complete).animate({top: obj[item].top, left: obj[item].left});
			}; // custom widget postion
		}; // end for
	}; // end if obj
}; // end var widget_position_restore


window.onpopstate = function(event) {
	console.log(event.state);
	if (event.state && event.state.user_Directory_ID) { // history state object has data
		if (event.state.user_Directory_ID === sources.webuser.Directory_ID) { // entry from current user
			prog_Main_Select(event.state.prog_ID,true,false); // save user preferences, do not push history again
		}; // end if entry from current user
 	};
};
