
WAF.onAfterInit = function onAfterInit() {// @lock
	var URL_Properties = URL_Value_Object_from_URL_Path(window.location.search); // get value object for key=value pairs in browser URL
	var language = (URL_Properties.language) ? URL_Properties.language : 'en';
	var content = URL_Properties.content;
	
	if (content) { // contentname defined
		sources.content.query('Name == :1 && Language == :2', content,language);
	}; // end if contentname defined
	
// @region namespaceDeclaration// @startlock
// @endregion// @endlock

// eventHandlers// @lock

// @region eventManager// @startlock
// @endregion
};// @endlock
