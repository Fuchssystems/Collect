
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
	}; // end this.localize
	
	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'User_Settings';
	// @endregion// @endlock

	this.load = function (data) {// @lock
	this.localize(); // localize DOM of from localization object

	// @region namespaceDeclaration// @startlock
	var button_Reset_Window_Coordinates = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	button_Reset_Window_Coordinates.click = function button_Reset_Window_Coordinates_click (event)// @startlock
	{// @endlock
		if (sources.webuser.Directory_ID) { // valid webuser entity that was created on server
			sources.webuser.Widget_Positions_JSON = '';
			widget_Pos_Saved_Initialize (); // re-initialize window and element coordingates
			sources.webuser.save({
				onError:function(error) {
					alert('OnError sources.webuser.Preferences_Save');
				}
			}); // end sources.webuser.Preferences_Save()
		}; // valid webuser entity that was created on server
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_button_Reset_Window_Coordinates", "click", button_Reset_Window_Coordinates.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
