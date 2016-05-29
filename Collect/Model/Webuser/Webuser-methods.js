
(model.Webuser.methods.Preferences_Load = function() {
	var current_User = currentUser();
	if (current_User) { // current user exists
		if (current_User.ID !== '00000000000000000000000000000000') { // logged in, no default guest
			var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', current_User.ID);
			if (!Webuser_Entity) { // logged in Webuser does not exists in datastore
				Webuser_Entity = ds.Webuser.createEntity();
				Webuser_Entity.Directory_ID = current_User.ID;
				Webuser_Entity.save();
			}; // end if logged in Webuser does not exists in datastore
			
			// check for directory in temporary Upload folder with name User.ID
			var folderPath_Picture_Uploads = ds.getDataFolder().path + 'Picture_Uploads';   
			var folderobj_Picture_Uploads = Folder(folderPath_Picture_Uploads);     // folder reference
			if (!folderobj_Picture_Uploads.exists) { // Top folder does not yet exists
				var ok_Flag = folderobj_Picture_Uploads.create();    // creates the temp folder
			}; // end if Top folder does not yet exists
			
			var folderPath_Userfolder = folderPath_Picture_Uploads + '/' + current_User.ID;
			var folderObj_Userfolder = Folder(folderPath_Userfolder);     // new folder reference
			if (!folderObj_Userfolder.exists) { // User folder does not yet exists
				ok_Flag = folderObj_Userfolder.create();    // creates the temp folder
			}; // end if User folder does not yet exists
			return Webuser_Entity;
		}; // end if logged in, no default guest	
	}; // end if current user exits
}).scope = 'public';


(model.Webuser.methods.Modify_Login_Details = function(new_Name, new_Password) {
	// Modify user name;
	
	var result = {       // result object returned to client
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};				
	
	var ok_Flag = true;
	ok_Flag = !!(new_Name);
	if(!ok_Flag) {
		result.error_text = 'No_name_entered';
	};
	if(ok_Flag) {
		var curUser = currentSession().user;
		var existing_User = directory.user(new_Name);
		if(existing_User) {
			if (existing_User.ID !== curUser.ID) { // existing user not same as current user
				ok_Flag = false;
				result.error_text = 'User_with_name_already_exists';
				result.error_params[0] = new_Name;
			}; // existing user not same as current user
		}; // existing_User
	}; // ok_Flag
	
	// Update directory
	if(ok_Flag) {
		var curUser_in_Datstore = directory.internalStore.User.find("ID = :1", curUser.ID);
		curUser_in_Datstore.fullName = new_Name;
		curUser_in_Datstore.name = new_Name;
		curUser_in_Datstore.save();
		var curUser_in_Directory = directory.user(curUser.ID);
		curUser_in_Directory.setPassword(new_Password);
		directory.save();
	}; // OK Flag
	return result;	
				
}).scope = 'public';


(model.Webuser.methods.User_Register_New = function(user_Name, user_Password, user_email, language, host) {
	var result = {       // result object returned to client
		entity: null, // new added entity
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};
			
	var ok_Flag = true;
	ok_Flag = !!(user_Name);
	if(!ok_Flag) {
		result.error_text = 'No_name_entered';
	};
	if(ok_Flag) {
		ok_Flag = !!(user_Password);
	};
	if(!ok_Flag) {
		result.error_text = 'No_password_entered';
	};
	if(ok_Flag) {
		ok_Flag = !!(user_email);
	};
	if(!ok_Flag) {
		result.error_text = 'No_email_entered';
	};
	if(ok_Flag) {
		ok_Flag = (user_email.indexOf('@') > -1) && (user_email.indexOf('.') > -1);
		if(!ok_Flag){
			result.error_text = 'Invalid_email_format';
		};
	};

	if(ok_Flag) {
		if (directory.user(user_Name)) { // a user with name already exists directory
			ok_Flag = false;
			result.error_text = 'User_with_name_already_exists';
			result.error_params[0] = user_Name;
		};
	};
	if(ok_Flag) {
		var existing_Webuser = ds.Webuser.find('Email = :1',user_email);
		if(existing_Webuser) {
			ok_Flag = false;
			result.error_text = 'User_with_email_already_exists';
			result.error_params[0] = user_email;
		};
	};
	
	if(ok_Flag) {
		// create new user in directory and dataclass Webuser
		var newUser = directory.addUser(user_Name, user_Password, user_Name);
		newUser.putInto ('Webuser');
		directory.save(); // do not forget to save the changes
		Webuser_Entity = ds.Webuser.createEntity();
		Webuser_Entity.Email = user_email;
		Webuser_Entity.Directory_ID = newUser.ID;
		Webuser_Entity.save();
		
		// create welcome credits in dataclass Credit_Transaction
		var Credit_Transaction_Entity = ds.Credit_Transaction.createEntity();
		Credit_Transaction_Entity.Kind = 'Welcome_Credit';
		Credit_Transaction_Entity.Date_Time_Entered = new Date();
		Credit_Transaction_Entity.Webuser = Webuser_Entity;
		Credit_Transaction_Entity.Authorized_by_Webuser = Webuser_Entity;
		Credit_Transaction_Entity.Amount_of_Credits = 5;
		Credit_Transaction_Entity.save();
	};
	
	// send registration email
	// get email variables
	if (ok_Flag) {
		if (!language) language = 'en'; // default language english
		var Content_Body_Entity = ds.Content.find('Name == :1 && Language == :2', 'email_registration_body',language);
		var Content_Subject_Entity = ds.Content.find('Name == :1 && Language == :2', 'email_registration_subject',language);
		ok_Flag = !!Content_Body_Entity && !!Content_Subject_Entity;
	}; // end if ok_Flag
	
	// replace variables in body
	if (ok_Flag) {
		if (!host) host = 'tirebiz.biz:8083';
		var pattern = /\<.*?\>/g;
		Content_Subject_Entity.Text = Content_Subject_Entity.Text.replace(pattern,'');
		Content_Body_Entity.Text = Content_Body_Entity.Text.replace('{hostname}',host);
		Content_Body_Entity.Text = Content_Body_Entity.Text.replace('{User_Name}',user_Name);
		Content_Body_Entity.Text = Content_Body_Entity.Text.replace('{Confirmation_ID}',Webuser_Entity.Directory_ID);
	}; // end if ok_Flag
	
	if(ok_Flag) {
		// log send email in dataclass Send_Email
		var Send_Email_Entity = ds.Send_Email.createEntity();
		Send_Email_Entity.Kind = 'Request_Confirmation';
		Send_Email_Entity.Subject = Content_Subject_Entity.Text;
		Send_Email_Entity.Bodytext = Content_Body_Entity.Text;
		Send_Email_Entity.Receiver_email = user_email;
		Send_Email_Entity.Webuser = Webuser_Entity;
		Send_Email_Entity.save();
		
		//create and send the email message
		include ('scripts/email_functions.js'); 
		var mail = require("waf-mail/mail");
		var message = new mail.Mail();
		message.subject = Content_Subject_Entity.Text;
		message.to = user_email;
		message.setBodyAsHTML(Content_Body_Entity.Text);		 		
		send_email(message); //send the email message
	}; // end if ok_Flag
	
	return result;
	
}).scope = 'public';


(model.Webuser.methods.Modify_Contact_Details = function(obj_Profile) {
	// Modify profile details
	var result = {       // result object returned to client
		entity: null, // new added entity
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};

	if (obj_Profile) { // object received from client
		var ok_Flag = true;
		// email
		ok_Flag = !!(obj_Profile.Email);
			if(!ok_Flag) {
			result.error_text = 'No_email_entered';
		};
		if(ok_Flag) {
			ok_Flag = (obj_Profile.Email.indexOf('@') > -1) && (obj_Profile.Email.indexOf('.') > -1);
			if(!ok_Flag){
				result.error_text = 'Invalid_email_format';
			};
		};
		
		// gender
		if(ok_Flag) {
			ok_Flag = !!obj_Profile.Gender;
			if(!ok_Flag){
				result.error_text = 'No_gender_specified';
			};
		};
		if(ok_Flag) {
			ok_Flag = (obj_Profile.Gender === 'male') || (obj_Profile.Gender === 'female') || (obj_Profile.Gender === 'undetermined');
			if(!ok_Flag){
				result.error_text = 'Invalid_gender';
			};
		};
		
		// date of birth
		if (ok_Flag) {
			ok_Flag = !!obj_Profile.Date_of_Birth; 
			if (!ok_Flag) {
				result.error_text = 'Invalid_Date_of_Birth';
			}; // end if !ok_Flag
		};
		if(ok_Flag) {
			var date_Date_of_Birth_received = isoToDate(obj_Profile.Date_of_Birth);
			var date_today = new Date();
			var date_limit_Age_18 = new Date();
			var date_limit_Age_100 = new Date();
			date_limit_Age_18.setTime(date_today.getTime() - (18*365*86400000));
			date_limit_Age_100.setTime(date_today.getTime() - (100*365*86400000));
			ok_Flag = (date_Date_of_Birth_received <= date_limit_Age_18) && (date_Date_of_Birth_received >= date_limit_Age_100);
			if (!ok_Flag) {
				result.error_text = 'Date_of_Birth_invalid_range';
			}; // end if !ok_Flag 
		}; // end if ok_Flag
		
		// save
		if (ok_Flag) {
			var current_User = currentSession().user;
			if (current_User) { // Session has current user
				var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', current_User.ID);
				if (Webuser_Entity) { // Webuser exists				
					Webuser_Entity.Email = obj_Profile.Email;
					if (obj_Profile.Phone) Webuser_Entity.Phone = obj_Profile.Phone;
					Webuser_Entity.Gender = obj_Profile.Gender;
					Webuser_Entity.Date_of_Birth = date_Date_of_Birth_received;
					Webuser_Entity.Country_Code = obj_Profile.Country_Code;
					Webuser_Entity.Postal_Code = obj_Profile.Postal_Code;
					Webuser_Entity.City = obj_Profile.City;
					Webuser_Entity.save();
				}; // end if Webuser exists
			}; // end if Session has current user
		}; // end if ok_Flag
		
		return result;
	}; // object received from client
}).scope = 'public';


(model.Webuser.methods.On_Uploaded_Pictures = function() {
	// Process files user uploaded in folder Datafolder/Picture_Uploads/User.ID
	var result = {       // result object returned to client
		entity: null, // new added entity
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};
	
	var curUser = currentSession().user;
	var folderPath_Userfolder = ds.getDataFolder().path + 'Picture_Uploads/' + curUser.ID;   
	var folderObj_Userfolder = Folder(folderPath_Userfolder);     // folder reference
	if (folderObj_Userfolder.exists) { // User folder exists
		folderObj_Userfolder.forEachFile (
			function (file) {
				var Picture = loadImage (file.path); // load the image from disk
				var User_Documents_Entity = ds.User_Documents.createEntity();
				User_Documents_Entity.Kind = 'Picture';
				User_Documents_Entity.Picture = Picture;
				User_Documents_Entity.Webuser = curUser.ID;
				User_Documents_Entity.save();
				file.remove(); // delete file from disk
			} // end function (file)
		); // end .forEachFile
	}; // end if User folder exists
	
	return result;
}).scope = 'public';


(model.Webuser.methods.Chat_Other_Members_Load = function(obj_Chatfilter) {
	// Load other Webusers to chat
	// base query to filter unwandted Webusers
	var query_string = '(No_Chat == null || No_Chat == false) && (Deleted == false || Deleted == null) && (Profile_Deactivated == null || Profile_Deactivated == false) && (Registration_Pending == false || Registration_Pending == null)  && Directory_ID !== :$userID';
	var orderBy_string = 'Name asc';
	var query_para_1 = new Date(); // querystring parameters
	var query_para_2 = new Date(); // querystring parameters

	var Webuser_Preference_Entity = ds.Webuser_Preference.find('Webuser.Directory_ID == :$userID');
	if (!Webuser_Preference_Entity) { // Webuser still has no Prefrence entity
		Webuser_Preference_Entity = ds.Webuser_Preference.createEntity();
		Webuser_Preference_Entity.Webuser = currentSession().user.ID;
		Webuser_Preference_Entity.save();
	}; // Webuser stil has no Preference entity		
		
	if (obj_Chatfilter) { // filter object passed
		// save filter parameters
		Webuser_Preference_Entity.Chatfilter_Gender_Female = obj_Chatfilter.Gender_Female;
		Webuser_Preference_Entity.Chatfilter_Gender_Male = obj_Chatfilter.Gender_Male;
		Webuser_Preference_Entity.Chatfilter_Gender_Undetermined = obj_Chatfilter.Gender_Undetermined;
		Webuser_Preference_Entity.Chatfilter_Unread_Messages = obj_Chatfilter.Unread_Messages;
		Webuser_Preference_Entity.Chatfilter_Online = obj_Chatfilter.Online;
		Webuser_Preference_Entity.Chatfilter_Webcam = obj_Chatfilter.Webcam;
		Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum = obj_Chatfilter.Age_Years_Minimum;
		Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum = obj_Chatfilter.Age_Years_Maximum;
		Webuser_Preference_Entity.Chatfilter_Distance = obj_Chatfilter.Distance;
		
		Webuser_Preference_Entity.save();
	}; // filter object passed

	if (Webuser_Preference_Entity.Chatfilter_Gender_Female || Webuser_Preference_Entity.Chatfilter_Gender_Male || Webuser_Preference_Entity.Chatfilter_Gender_Undetermined) { // Gender filter group for or query
		query_string += ' && (';
		var first_flag = true;
		
		if (Webuser_Preference_Entity.Chatfilter_Gender_Female) {
			query_string += 'Gender == female';
			first_flag = false
		}; // end if
		
		if (Webuser_Preference_Entity.Chatfilter_Gender_Male) {
			if (!first_flag) {
				query_string += ' || ';
			}; // end if !first_flag
			first_flag = false;
			query_string += 'Gender == male';
		}; // end if
		
		if (Webuser_Preference_Entity.Chatfilter_Gender_Undetermined) {
			if (!first_flag) {
				query_string += ' || ';
			}; // end if !first_flag
			query_string += 'Gender == undetermined';
		}; // end if			
		query_string += ')';
	}; // end if Gender filter group for or query
	
	if (Webuser_Preference_Entity.Chatfilter_Webcam) {
		query_string += ' && Videochat_Activated == true';
	}; // end if	
	
	if(Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum || Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum) {
		var date_today = new Date();
		var date_limit_Age = new (Date);
		query_string += ' && (';
		var first_flag = true;
		if (Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum) {
			// Calculate base date for minimum age
			if (Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum > 0 && Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum < 100) { // valid age in yeary
				date_limit_Age.setTime(date_today.getTime() - (Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum*365*86400000));
				query_string += 'Date_of_Birth <= :1';
				query_para_1 = date_limit_Age;
				first_flag = false;
			}; // end if valid age in years
		}; // end if Webuser_Preference_Entity.Chatfilter_Age_Years_Minimum

		if (Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum) {
			// Calculate base date for maximum age
			if (Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum > 0 && Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum < 100) { // valid age in yeary
				date_limit_Age = new Date();
				date_limit_Age.setTime(date_today.getTime() - (Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum*365*86400000));
				if (!first_flag) {
					query_string += ' && ';
				}; // end if !first_flag
				query_string += 'Date_of_Birth >= :2';
				query_para_2 = date_limit_Age;
			}; // end if valid age in years
		}; // end if Webuser_Preference_Entity.Chatfilter_Age_Years_Maximum
		query_string += ')';
	}; // end if

	if (Webuser_Preference_Entity.Chatfilter_Online || Webuser_Preference_Entity.Chatfilter_Unread_Messages || Webuser_Preference_Entity.Chatfilter_Distance > 0) { // Filter has calculated attributes
		var Webuser_Coll_Result = ds.Webuser.query(query_string,query_para_1, query_para_2);
		var Webuser_Coll_Temp = null;
				
		if (Webuser_Preference_Entity.Chatfilter_Online) { // Query for calculated attribute Is_Online
			var token = currentSession().promoteWith('Admin');
			var arrUsersSessions = getUserSessions();
			currentSession().unPromote(token); // back to the initial access rights
			
			Webuser_Coll_Temp = ds.Webuser.createEntityCollection();
			Webuser_Coll_Result.forEach(
				function(Webuser_Entity) {
					for (var i = 0, len = arrUsersSessions.length; i < len; i++) {
						if (arrUsersSessions[i].user.ID === Webuser_Entity.Directory_ID) { // Webuser is in array of User sessions
							Webuser_Coll_Temp.add(Webuser_Entity);
							break;
						}; // end ifWebuser is in array of User sessions 
					}; // end for
				} // end function
			); // end .forEach()			
			Webuser_Coll_Result = Webuser_Coll_Result.and(Webuser_Coll_Temp);
		}; // end if Query for calculated attribute Is_Online
		
		if (Webuser_Preference_Entity.Chatfilter_Unread_Messages) { // Query for Unread Messages
			Webuser_Coll_Temp = ds.Webuser.createEntityCollection();
			var Chatmessage_Coll = null;
			Webuser_Coll_Result.forEach(
				function(Webuser_Entity) {
					Chatmessage_Coll = ds.Chatmessage.query('Webuser_Receiver.Directory_ID == :1 && Webuser_Sender.Directory_ID == :2 && Read_by_Receiver = false',currentUser().ID,Webuser_Entity.Directory_ID);
					if (Chatmessage_Coll.length > 0) Webuser_Coll_Temp.add(Webuser_Entity);
				} // end function
			); // end .forEach()			
			Webuser_Coll_Result = Webuser_Coll_Result.and(Webuser_Coll_Temp);
		}; // end if Query for calculated attribute Is_Online
		
		if (Webuser_Preference_Entity.Chatfilter_Distance > 0) { // Query for Distance
			Webuser_Coll_Temp = ds.Webuser.createEntityCollection();
			Webuser_Coll_Result.forEach(
				function(Webuser_Entity) {
					if (parseInt(Webuser_Entity.Distance_to_Current_Webuser_String_Calculated) <= Webuser_Preference_Entity.Chatfilter_Distance) Webuser_Coll_Temp.add(Webuser_Entity);
				} // end function
			); // end .forEach()			
			Webuser_Coll_Result = Webuser_Coll_Result.and(Webuser_Coll_Temp);
		}; // end if Query for Distance
		
		Webuser_Coll_Result.orderBy(orderBy_string);
		return Webuser_Coll_Result;
	} // end if // Filter has calculated attributes
	else { // no Filter with calcualted attributs;
		query_string = query_string + ' order by ' + orderBy_string;
		return ds.Webuser.query(query_string,query_para_1, query_para_2);
	}; // end else no filter with calculated attributes	
}).scope = 'public';


(model.Webuser.methods.User_Profile_Remove_by_User = function() {
	// Remove profile by Webuser;
	// save name and password in archive attributes
	// set new password to 'Deleted'
	// set new name to user.ID
	// set attribute 'Deleted' to true
	var curUser = currentSession().user;
	if (curUser) { // current user exists in directory
		var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', curUser.ID);
		if (Webuser_Entity) { // Webuser exists	
			var old_Name = Webuser_Entity.Name;
			var old_Email = Webuser_Entity.Email;
			Webuser_Entity.Deleted_Name = old_Name;	
			Webuser_Entity.Deleted_Email = old_Email;			
			Webuser_Entity.Email = '';
			Webuser_Entity.Deleted = true;
			Webuser_Entity.save();
		}; // end if Webuser exists
		
		var token = currentSession().promoteWith('Admin');
		var curUser_in_Datstore = directory.internalStore.User.find("ID = :1", curUser.ID);
		curUser_in_Datstore.fullName = curUser.ID;
		curUser_in_Datstore.name = curUser.ID;
		curUser_in_Datstore.save();
		var curUser_in_Directory = directory.user(curUser.ID);
		curUser_in_Directory.setPassword('');
		directory.save();
		currentSession().unPromote(token); // back to the initial access rights
	}; // end if current user exists in directory
}).scope = 'public';


(model.Webuser.methods.Registraion_Confirm_email_resend = function() {
	// resend request for confirmation email
	var current_User = currentSession().user;
	if (current_User) { // Session has current user
		var Last_Send_Email_Coll = ds.Send_Email.query('Webuser.Directory_ID == :1 && Kind == :2 order by Date_Send desc', current_User.ID, 'Request_Confirmation');
		if(Last_Send_Email_Coll.length > 0) { // at least 1 email has been send
			var Last_Send_Email_Entity = Last_Send_Email_Coll[0];
			var New_Send_Email_Entity = ds.Send_Email.createEntity();
			New_Send_Email_Entity.Kind = Last_Send_Email_Entity.Kind;
			New_Send_Email_Entity.Subject = Last_Send_Email_Entity.Subject;
			New_Send_Email_Entity.Bodytext = Last_Send_Email_Entity.Bodytext;
			New_Send_Email_Entity.Receiver_email = Last_Send_Email_Entity.Receiver_email;
			New_Send_Email_Entity.save();
			
			include ('scripts/email_functions.js'); 
			//create and send the email message
			var mail = require("waf-mail/mail");
			var message = new mail.Mail();
			message.subject = New_Send_Email_Entity.Subject;
			message.to = New_Send_Email_Entity.Receiver_email;
			message.setBodyAsHTML(New_Send_Email_Entity.Bodytext);		 		
			send_email(message); //send the email message
		}; // at least 1 email has been send
	}; // end if Session has current user	
}).scope = 'public';


(model.Webuser.methods.Confirm_Registration = function(Link_ID) {
	//confirm registration with email link
	
	var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', Link_ID);
	if (!Webuser_Entity) return 'invalid_Link';
	if (!Webuser_Entity.Registration_Pending) return 'already_confirmed';
	
	var Send_Email_Coll = ds.Send_Email.query('Webuser.Directory_ID == :1 && Kind == :2 order by Date_Send desc', Link_ID, 'Request_Confirmation');
	if(Send_Email_Coll.length === 0) return 'invalid_Link';
	
	Webuser_Entity.Registration_Pending = false;
	Webuser_Entity.save();
	return 'confirmation_OK';
		
}).scope = 'public';


(model.Webuser.methods.User_Profile_Geocoordinates_Modify = function(obj_LatLng) {
	// Modify geo coordnites of Webuser address
	// generated by maps.google on client
	// to do: google maps query should be moved serverside
	if (obj_LatLng) {
		var current_User = currentSession().user;
		if (current_User) { // Session has current user
			var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', current_User.ID);
			if (Webuser_Entity) { // Webuser exists				
				Webuser_Entity.Address_Coordinates_Lattidude = obj_LatLng.k;
				Webuser_Entity.Address_Coordinates_Longitude = obj_LatLng.D;
				Webuser_Entity.save();
			}; // end if Webuser exists
		}; // end if Session has current user
	}; // end if obj_LatLng
}).scope = 'public';
