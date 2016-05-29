
// custom Login listener
var loginListener = function(username, password) {
	if (username == 'Superuser') return false; // revert to directory authentication

	var Webuser_Entity = null;
	var User_Entity = directory.internalStore.User.find('name == :1', username);
	if (!User_Entity) { // no user with this exists in directory
		// try email from dataclass Webuser
		Webuser_Entity = ds.Webuser.find('Email = :1',username); 
		if (Webuser_Entity) { // Webuser with email exists
			User_Entity = directory.internalStore.User.find('ID == :1', Webuser_Entity.Directory_ID);
		}; // end if Webuser with email exists
	}; // end if no user with this exists in directory
	if (User_Entity && !Webuser_Entity) { // Webuser not searched because of name search in directory only
		Webuser_Entity = ds.Webuser.find('Directory_ID = :1',User_Entity.ID); 
	}; // end if Webuser not searched because of name search in directory only

	if (!User_Entity || !Webuser_Entity) return { error: 1024, errorMessage:"invalid_login" };
			
	var hashed_Key = null;
	var Password_OK_Flag = false;
	hashed_Key = directory.computeHA1(User_Entity.name, password); 
	Password_OK_Flag = hashed_Key == User_Entity.password
	if (!Password_OK_Flag) return { error: 1024, errorMessage:"invalid_login" }
	
	var User_Object = {}; // user object to return
	User_Object = directory.user(User_Entity.ID);
	return User_Object;
}; // end var loginListener