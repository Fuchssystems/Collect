
// custom Login listener
var loginListener = function(username, password) {
	var User_Entity = directory.internalStore.User.find('name == :1', username);
	if (!User_Entity) { // no user with this exists in directory
		// try email from dataclass Webuser
		var Webuser_Entity = ds.Webuser.find('Email = :1',username); 
		if (Webuser_Entity) { // Webuser with email exists
			User_Entity = directory.internalStore.User.find('ID == :1', Webuser_Entity.Directory_ID);
		}; // end if Webuser with email exists
	}; // end if no user with this exists in directory
	
	var hashed_Key = null;
	var User_exists_Flag = false;
	var User_Object = {}; // user object to return
	if(User_Entity) { // User with name exists
		hashed_Key = directory.computeHA1(User_Entity.name, password); 
		User_exists_Flag = hashed_Key == User_Entity.password
	}; // end if User with name exists
	
	if(User_exists_Flag) { // User exists in directory
		User_Object = directory.user(User_Entity.ID);
		User_Object.test = 'test';
        return User_Object;
	} // end if User exists in directory
	else { // User does not exists in directory
		return { error: 1024, errorMessage:"invalid login" }
	}; // end else User does not exists in directory
}; // end var loginListener