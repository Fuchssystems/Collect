
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.content_name_current = ''; // current contentname

	this.Content_Load = function (content_to_load, language_to_load) {
		if (content_to_load) { // content to display defined
			ds.Content.Load_Name_Language({     
				onSuccess: function(event) {
					if (event.result) { // content exists
						$$(getHtmlId('textFlow_1')).setValue(event.result.Text.getValue());
					}; // end if content exists
				}, // end onSuccess
				onError: function(error) {
					alert('OnError ds.Content.Load_Name_Language');
				}}, // end onError
				content_to_load, language_to_load
			); // end ds.Content.Load_Name_Language()
		}; // end if content to display defined
	}; // end this.Contant_Load
	
	this.localize = function (language_to_set) {
	 	// localize DOM from localization object - component has no objects to localize
	 	this.Content_Load(this.content_name_current, language_to_set);
	}; // end this.localize
	
	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Home';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		this.content_name_current = data.userData.textFlow_1_contentName;  // current contentname
		this.Content_Load(data.userData.textFlow_1_contentName, app_Languages.current_set);
		
	// @region namespaceDeclaration// @startlock
	// @endregion// @endlock

	// eventHandlers// @lock

	// @region eventManager// @startlock
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
