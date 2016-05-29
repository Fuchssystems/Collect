


(model.Webuser_Preference.methods.Load_Preference_Current_Webuser = function() {
	// Load preference for current webuser
	var Webuser_Preference_Entity = ds.Webuser_Preference.find('Webuser.Directory_ID == :$userID');
	return Webuser_Preference_Entity;
}).scope = 'public';
