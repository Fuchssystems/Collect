
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
	}; // end this.localize
	
	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Customers';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		widget_position_restore (data.userData.prog_ID, id); // move widgets to saved positions (after dragging)
	
		gmap_Initial_Selection_Put_Flag = false; // Flag google maps initializes with initial company selection
		gmap_Markers = []; // Array of google maps markers
		
		this.localize(); // localize DOM of from localization object
		widget_Drag_Parameters_Set(data.userData.prog_ID, id); // initialize draggable widget with saved positions
		
		var map_initialize = function () {
	        var map_canvas = document.getElementById('component_Main_google_map');
	        var map_options = {
	          center: new google.maps.LatLng(52.295926, 9.478554),
	          zoom: 8,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
	        map = new google.maps.Map(map_canvas, map_options);
	     }; // end var map_initialize
	    map_initialize ();
      
	// @region namespaceDeclaration// @startlock
	var button2 = {};	// @button
	var companyEvent = {};	// @dataSource
	var button1 = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		if (testmarker) {
			testmarker.setMap(null);
			testmarker = null;
		}; // end if
	};// @lock

	companyEvent.onBeforeCurrentElementChange = function companyEvent_onBeforeCurrentElementChange (event)// @startlock
	{// @endlock
		if (gmap_Initial_Selection_Put_Flag) { // not initialization of map markers
			company_gmaps_marker_entity_put(false); // change state of google maps marker for address to not selected;
		}; // end if not initialization of map markers
	};// @lock

	companyEvent.onCurrentElementChange = function companyEvent_onCurrentElementChange (event)// @startlock
	{// @endlock
		company_gmaps_marker_entity_put(gmap_Initial_Selection_Put_Flag); // put google maps marker for address;
	};// @lock

	companyEvent.onCollectionChange = function companyEvent_onCollectionChange (event)// @startlock
	{// @endlock
		if (!gmap_Initial_Selection_Put_Flag) { // initial selection still not put on map
			// put markers for all customers in collection on map
		    for (i = 0; i < sources.component_Main_company.length; i++) {                
                sources.component_Main_company.select(i, {
                	onSuccess: function (event) {
                		// company_gmaps_marker_entity_put(); // put google maps marker for address;
                	} // end OnSuccess
            	}); // end sources.component_Main_company.select
            }; // end for
			gmap_Initial_Selection_Put_Flag = true; // Flag google maps initializes with initial company selection
		}; // end if initial selection still not put on map
	};// @lock

	companyEvent.onCityAttributeChange = function companyEvent_onCityAttributeChange (event)// @startlock
	{// @endlock
		if (event.eventKind === 'onAttributeChange') {
			company_gmaps_marker_entity_put(); // put google maps marker for address
		}; // end if event.kind onAttributeChange
	};// @lock

	companyEvent.onPostalcodeAttributeChange = function companyEvent_onPostalcodeAttributeChange (event)// @startlock
	{// @endlock
		if (event.eventKind === 'onAttributeChange') {
			company_gmaps_marker_entity_put(); // put google maps marker for address
		}; // end if event.kind onAttributeChange
	};// @lock

	companyEvent.onStreetAttributeChange = function companyEvent_onStreetAttributeChange (event)// @startlock
	{// @endlock
		if (event.eventKind === 'onAttributeChange') {
			company_gmaps_marker_entity_put(); // put google maps marker for address
		}; // end if event.kind onAttributeChange
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({address: 'Egestorfer Str.32, 30890 Barsinghausen'}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
		    map.setCenter(results[0].geometry.location);
		    testmarker = new google.maps.Marker({
		        map: map,
		        position: results[0].geometry.location,
		        title: 'Tirebiz',
		        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
		    });
		    testmarker.test = 'test';
		    google.maps.event.addListener(testmarker, 'click', function() {
    			alert('Marker geklicked. ' + testmarker.test);
  			});
		  }
		});
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_company", "onBeforeCurrentElementChange", companyEvent.onBeforeCurrentElementChange, "WAF");
	WAF.addListener(this.id + "_company", "onCurrentElementChange", companyEvent.onCurrentElementChange, "WAF");
	WAF.addListener(this.id + "_button2", "click", button2.click, "WAF");
	WAF.addListener(this.id + "_company", "onCollectionChange", companyEvent.onCollectionChange, "WAF");
	WAF.addListener(this.id + "_company", "onCityAttributeChange", companyEvent.onCityAttributeChange, "WAF", "City");
	WAF.addListener(this.id + "_company", "onPostalcodeAttributeChange", companyEvent.onPostalcodeAttributeChange, "WAF", "Postalcode");
	WAF.addListener(this.id + "_company", "onStreetAttributeChange", companyEvent.onStreetAttributeChange, "WAF", "Street");
	WAF.addListener(this.id + "_button1", "click", button1.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
