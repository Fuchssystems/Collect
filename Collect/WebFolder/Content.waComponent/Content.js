
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
	}; // end this.localize
	
	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Content';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		this.localize();

	// create entities for all key/language combination
	var arr_keys = ['Welcome', 'Logged_In_Base', 'AGB', 'Impressum','email_registration_body', 'email_registration_subject'];
	for (var i = 0, len = arr_keys.length; i < len; i++) {
		for (var k = 0, k_len = app_Languages.supported.length; k < k_len; k++) {
			var userData_Obj = {};
			userData_Obj.Key = arr_keys[i];
			userData_Obj.Language = app_Languages.supported[k];
			var Content_Coll = ds.Content.query('Name == :1 && Language == :2', {
				params: [arr_keys[i], app_Languages.supported[k]],
				onSuccess: function (event) {
					if (event.result.length === 0) { // key/name combination does not exist		
						sources.component_Main_content.newEntity();
						sources.component_Main_content.Name = event.userData.Key;
						sources.component_Main_content.Language = event.userData.Language;
						sources.component_Main_content.Text = '<p>' + event.userData.Key + ' ' + event.userData.Language + '</p>';
						sources.component_Main_content.save({
							onSuccess: function (event) {
								sources.component_Main_content.addEntity(sources.component_Main_content.getCurrentElement());
								sources.component_Main_content.all({orderBy: 'Name asc, Language asc'});	 
							} // end onSuccess
						});
					}; // end if key/name combination does not exist
				}, // end OnSuccess
				onError: function (error) {
					alert('Error');
					console.log(error);
				}, // end onError
				userData: userData_Obj
			}); // end .query		
		}; // end for k
	}; // end for i
	sources.component_Main_content.all({orderBy: 'Name asc, Language asc'});	
		
	// @region namespaceDeclaration// @startlock
	// @endregion// @endlock

	// eventHandlers// @lock

	// @region eventManager// @startlock
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
