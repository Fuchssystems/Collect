

model.Webuser.Name.onGet = function() {
	var returnValue = '';
	var User_in_Directory = directory.internalStore.User.find("ID = :1", this.Directory_ID);
	if (User_in_Directory) { // User of message exists in directory
		returnValue = User_in_Directory.fullName;
	}; // end if User of message exists in directory
	return returnValue;
};


model.Webuser.Creditpoint_Balance.onGet = function() {
	return this.credit_TransactionCollection.sum('Amount_of_Credits');
};


model.Webuser.EUR_Balance.onGet = function() {
	return this.credit_TransactionCollection.sum('EUR');
};


model.Webuser.Country_Code.events.onInit = function() {
	this.Country_Code = true;
};


model.Webuser.No_Chat.events.onInit = function() {
	this.No_Chat = false;
};


model.Webuser.Main_Picture_Calculated.onGet = function() {
	// get main picture for webuser
	// if no picture has attribute Main_Picture set, take with lowest ID
	var Picture_to_Return = null;
	var User_Documents_Collection = ds.User_Documents.query('Webuser.Directory_ID == :1 && Main_Picture == true', this.Directory_ID);
	if (User_Documents_Collection.length === 0) { // not entities found
		User_Documents_Collection = ds.User_Documents.query ('Webuser.Directory_ID == :1', this.Directory_ID);
	}; // end if no entities found
	if (User_Documents_Collection.length >= 1) { // 1 or more entities found
		Picture_to_Return = User_Documents_Collection[0].Picture; // first entity in collection
	}; // end if 1 or more entities found
	
	return Picture_to_Return;
};


model.Webuser.Picture_Unread_Messages_Calculated.onGet = function() {
	// get picture if Webuser has unread Chatmessages
	var Picture_to_Return = null;	
	var Chatmessage_Coll = ds.Chatmessage.query('Webuser_Receiver.Directory_ID == :1 && Webuser_Sender.Directory_ID == :2 && Read_by_Receiver = false',currentUser().ID,this.Directory_ID);

	if (Chatmessage_Coll.length > 0) { // Webuser has unread messages
		Picture_to_Return = loadImage(getFolder('path') + 'Images/onebit_42.png');
	}; // end if Webuser has unread messages
	
	return Picture_to_Return;
};


model.Webuser.Unread_Messages_Calculated.onGet = function() {
	// return if Webuser has unread Chatmessages
	var Chatmessage_Coll = ds.Chatmessage.query('Webuser_Receiver.Directory_ID == :1 && Webuser_Sender.Directory_ID == :2 && Read_by_Receiver = false',currentUser().ID,this.Directory_ID);
	return (Chatmessage_Coll.length > 0);
};


model.Webuser.Age_in_Years_in_Brackets.onGet = function() {
	// return age in years in Brackets example: (34);
	// get age from date - copied from http://stackoverflow.com/questions/4060004/calculate-age-in-javascript - modified
	var Date_getAge = function (date) {
	    if (!date) date = new Date();
	    var today = new Date();
	    return ((today.getFullYear() + today.getMonth() / 100
	    + today.getDate() / 10000) - (date.getFullYear() + 
	    date.getMonth() / 100 + date.getDate() / 10000));
	}; // end var Date_getAge

	returnvalue = '';
	if (this.Date_of_Birth) { // Birthday defined
		returnvalue = '(' + ~~Date_getAge(this.Date_of_Birth) + ')';
	}; // Birthday defined
	return returnvalue;
};


model.Webuser.Country_Code_Postal_Code_Formatted.onGet = function() {
	// return Contry Code '-' Postal Code. Example D-30890
	var returnvalue = this.Country_Code;
	if (this.Postal_Code) returnvalue += ('-' + this.Postal_Code);
	if (this.City) returnvalue += (' ' + this.City);	
	return returnvalue;
};


model.Webuser.Profile_Deactivated.events.onInit = function() {
	this.Profile_Deactivated = false;
};


model.Webuser.Deleted.events.onInit = function() {
	this.Deleted = false;
};

model.Webuser.Registration_Pending.events.onInit = function() {
	this.Registration_Pending = true;
};

model.Webuser.events.onRemove = function() {
	// remove related 1->n entities
	this.credit_TransactionCollection.remove();
	this.user_DocumentsCollection.remove();
	this.chatmessageCollectionSender.remove();
	this.chatmessageCollectionReceiver.remove();
	this.send_EmailCollection.remove();
	this.PayPalSubmission.remove();
	
	// remove corresponding user in directory
	var token = currentSession().promoteWith('Admin');
	var curUser_in_Directory = directory.user(this.Directory_ID);
	if (curUser_in_Directory) { // user exists in directory
		curUser_in_Directory.remove();
		directory.save();
	}; // end if user exists in directory
	currentSession().unPromote(token); // back to the initial access rights
};


model.Webuser.Is_Online_Calculated.onGet = function() {
	//get online status;
	var result = false;
	var token = currentSession().promoteWith('Admin');
	var arrUsersSessions = getUserSessions();
	currentSession().unPromote(token); // back to the initial access rights

	for (var i = 0, len = arrUsersSessions.length; i < len; i++) {
		if (arrUsersSessions[i].user.ID === this.Directory_ID) { // Webuser is in array of User sessions
			result = true;
			break;
		}; // end ifWebuser is in array of User sessions 
	}; // end for
	
	return result;
};


model.Webuser.Distance_to_Current_Webuser_String_Calculated.onGet = function() {
	var result = '';
			
	var current_User = currentSession().user;
	if (current_User) { // Session has current user
		var Current_Webuser_Entity = ds.Webuser.find('Directory_ID == :1', current_User.ID);
		if (Current_Webuser_Entity) { // Current Webuser exists	
			include ('scripts/Utility_functions.js');
			var latLngA = {
				k: Current_Webuser_Entity.Address_Coordinates_Lattidude,
				D: Current_Webuser_Entity.Address_Coordinates_Longitude
			};
			var latLngB = {
				k: this.Address_Coordinates_Lattidude,
				D: this.Address_Coordinates_Longitude
			};
			result = parseInt(getDistanceFromLatLonInKm (latLngA.k,latLngA.D,latLngB.k,latLngB.D)) + ' km';			
		}; // end if Current Webuser exists
	}; // end if Session has current user
	
	return result;
};
