

(model.Connection.methods.Load_Create = function(Webuser_ID_Other) {
	// Load connection for 2 Webusers, create if not existing
	var ID_Lower = '';
	var ID_Higher = '';
	var curUser = currentSession().user;
	if (curUser.ID < Webuser_ID_Other) {
		ID_Lower = curUser.ID;
		ID_Higher = Webuser_ID_Other;
	} // end if
	else {
		ID_Lower = Webuser_ID_Other;
		ID_Higher = curUser.ID;
	}; // end else
	
	var Connection_Entity = ds.Connection.find('Webuser_ID_Lower == :1 && Webuser_ID_Higher == :2', ID_Lower, ID_Higher);	
	if (!Connection_Entity) { // Connection does not exist
		Connection_Entity = ds.Connection.createEntity();
		Connection_Entity.Webuser_ID_Lower = ID_Lower;
		Connection_Entity.Webuser_ID_Lower = ID_Higher;
		Connection_Entity.save();
	}; // end if Connection does not exist
	
	return Connection_Entity;
}).scope = 'public';
