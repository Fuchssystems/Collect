// functions component customers

// function put google maps marker for address
var gmaps_marker_put_for_address = function (address, title, markers_array, entity_ID, selected) {
	// remove old marker for entity ID
	if (typeof(entity_ID) !== 'undefined') { // entity ID passed
		var index_old = -1;
		for (var i = 0, len = markers_array.length; i < len; i++) {
			if (markers_array[i].entity_ID == entity_ID) { // match
				index_old = i;
				i = len;
			}; // end if match
		}; // end for
		if (index_old !== -1) { // old marker exists
			markers_array[index_old].marker.setMap(null); // remove old marker
			delete (markers_array, index_old);
			console.log('marker deleted');
		}; // end if old marker exists
	}; // end if entity ID passed
	
	selected = selected || false; // entity selected flag used for special marker color
	var geocoder = new google.maps.Geocoder();
	geocoder.title = title;
	geocoder.entity_ID = entity_ID;
	var icon_URL = 'http://maps.google.com/mapfiles/ms/icons/';
	if (selected) { // entity selected
		geocoder.icon_URL = icon_URL += 'red-dot.png';
	} // entity selected
	else { // entity not selected
		geocoder.icon_URL = icon_URL += 'green-dot.png';
	}; // end else entity not selected
	geocoder.geocode({address: address}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	  	console.log('status OK, title: ' + title + ', selected: ' + selected);
	    //map.setCenter(results[0].geometry.location);
	    var marker = new google.maps.Marker({
	        map: map,
	        position: results[0].geometry.location,
	        title: geocoder.title,
	        icon: geocoder.icon_URL
	    }); // end new google.maps.Marker()
	    var index = markers_array.length;
	    markers_array[index] = {};
	    markers_array[index].marker = marker;
	    markers_array[index].entity_ID = entity_ID;
	    
	    // add on click event handler to added marker
	    marker.entity_ID = geocoder.entity_ID;
	    google.maps.event.addListener(marker, 'click', function() {
	    	sources.component_Main_company.selectByKey(marker.entity_ID );
  		});
	  }; // end if status OK
	}); // end gowcoder.geocode
}; // end var gmaps_marker_set_from_address

// put maps marker for company entity
var company_gmaps_marker_entity_put = function (selected_Entity_Flag) {
	if (!selected_Entity_Flag) selected_Entity_Flag || false;
	if (sources.component_Main_company.Company_Name && sources.component_Main_company.Street && sources.component_Main_company.Postalcode && sources.component_Main_company.City) { // valid address
		var address = sources.component_Main_company.Street + ', ' + sources.component_Main_company.Postal_Code + ' ' + sources.component_Main_company.City;
		gmaps_marker_put_for_address(address, sources.component_Main_company.Company_Name, gmap_Markers, sources.component_Main_company.ID, selected_Entity_Flag);  // put google maps marker for address
	}; // end if valid address	
}; // end var company_gmaps_marker_set
