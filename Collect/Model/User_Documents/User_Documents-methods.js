

(model.User_Documents.methods.Remove_Selected_Entities = function() {
	// remove entities with attribute 'Selected_to_Remove' for current user
	var result = {       // result object returned to client
		entity: null, // new added entity
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};
	
	var current_User = currentUser();
	if (current_User) { // current user exists
		var selection_to_remove = ds.User_Documents.query('Webuser.Directory_ID == :1 && Selected_to_Remove == true', current_User.ID);
		selection_to_remove.remove();
	}; // end if current user exists
	
	return result;
}).scope = 'public';


(model.User_Documents.methods.Main_Picture_Set = function(New_Main_Picture_ID) {
	// set main picture for user
	var result = {       // result object returned to client
		entity: null, // new added entity
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};
	
	var current_User = currentUser();
	if (current_User) { // current user exists
		// remove old main picture attribute setting
		var user_Documents_Collection = ds.User_Documents.query('Webuser.Directory_ID == :1 && Main_Picture == true', current_User.ID);
		user_Documents_Collection.forEach(
			function (Entity_User_Documents) {
				Entity_User_Documents.Main_Picture = false;
			} // end function
		); // end .forEach
		
		// set the new main picture
		var user_Documents_Entity = ds.User_Documents.find('ID == :1 && Webuser.Directory_ID == :2', New_Main_Picture_ID, current_User.ID);
		if (user_Documents_Entity) { // entity exists
			user_Documents_Entity.Main_Picture = true;
			user_Documents_Entity.save();
		}; // end if entity existes
	}; // end if current user exists
	
	return result;
}).scope = 'public';

