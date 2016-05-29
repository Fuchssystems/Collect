

(model.Chatmessage.methods.Message_New = function(newMessage_Text, Receiver_Webuser_ID) {
	var result = {       // result object returned to client
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};	
	var ok_Flag = true;
	ok_Flag = !!(newMessage_Text);
	if(!ok_Flag) {
		result.error_text = 'No_mesage_text';
	};

	// Check other Webuser ID
	if (ok_Flag) {
		ok_Flag = !!Receiver_Webuser_ID;
	};
	if (ok_Flag) {
		var current_User = currentSession().user;
		ok_Flag = !!current_User; // test if Session has current user
	};
	if (ok_Flag) {
		ok_Flag = (current_User.ID !== Receiver_Webuser_ID); // test for different users
	};

	if (ok_Flag) { // Message and user OK
		var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', current_User.ID);
		if (Webuser_Entity) { // Webuser exists
			ok_Flag = (Webuser_Entity.Creditpoint_Balance >= 1);
			if(!ok_Flag) {
				result.error_text = 'Out_of_credits';
			};
			
			if (ok_Flag) { // OK to save
				var Chatmessage_Entity = ds.Chatmessage.createEntity();
				Chatmessage_Entity.Webuser_Sender = current_User.ID;
				Chatmessage_Entity.Webuser_Receiver = Receiver_Webuser_ID;
				Chatmessage_Entity.Messagetext = newMessage_Text;
				Chatmessage_Entity.save();
				
				// Create entity in Credit_Transaction
				var Credit_Transaction_Entity = ds.Credit_Transaction.createEntity();
				Credit_Transaction_Entity.Kind = 'Chat';
				Credit_Transaction_Entity.Date_Time_Entered = new Date();
				Credit_Transaction_Entity.Webuser = current_User.ID;
				Credit_Transaction_Entity.Authorized_by_Webuser = current_User.ID;
				Credit_Transaction_Entity.Amount_of_Credits = -1;
				Credit_Transaction_Entity.save();
				
				// send notification to receiver client via webworker
				var worker = new SharedWorker("Workers/Chat_Worker.js", "chat");
				if (worker) { // webworker exists
					var obj_to_send = {
						kind: 'new_chatmessage',
						user_ID: current_User.ID,
						receiver_Webuser_ID: Receiver_Webuser_ID
					}; // end var obj_to_send
					worker.port.postMessage(JSON.stringify(obj_to_send));
				}; // end if webworker exists
				
				// return updated chatmassage text block to sender of new message
				result.Chattext = ds.Chatmessage.Messages_Userpair_Load_HTML(Receiver_Webuser_ID);
			}; // OK to save
		}; // Webuser exists
	}; // Message and user OK
	
	return result;
}).scope = 'public';


(model.Chatmessage.methods.Messages_Userpair_Load_HTML = function(other_Webuser_ID) {
	// Load Chatmessages for userpair HTML-formatted for display on client;
	var returnHTML = ''; // HTML to return
	var current_User = currentSession().user;
	var User_in_Directory = null;
	if (current_User && other_Webuser_ID) { // Session has current user and other user defined
		var Chatmessage_Coll = ds.Chatmessage.query('Webuser_Sender.Directory_ID == :1 && Webuser_Receiver.Directory_ID == :2',current_User.ID,other_Webuser_ID);
		var Chatmessage_Coll_Other_Webuser = ds.Chatmessage.query('Webuser_Sender.Directory_ID == :2 && Webuser_Receiver.Directory_ID == :1',current_User.ID,other_Webuser_ID);
		Chatmessage_Coll.add(Chatmessage_Coll_Other_Webuser); // messages exchanged between the 2
		if (Chatmessage_Coll) { // Chatmessage collections exists
			var Chatmess_Coll_Final = Chatmessage_Coll.orderBy('Date_Time desc');
			var Webuser_Sender_Entity = ds.Webuser.find('Directory_ID == :1', current_User.ID);
			var Webuser_Receiver_Entity = ds.Webuser.find('Directory_ID == :1', other_Webuser_ID);
			if (Webuser_Sender_Entity && Webuser_Receiver_Entity) { // Sender and receiver Webuser exits
				var time_string = '';
				for (var Chatmessage_Entity = Chatmess_Coll_Final.first(); Chatmessage_Entity != null; Chatmessage_Entity = Chatmessage_Entity.next()) {
					if (Chatmessage_Entity.Webuser_Sender.Directory_ID === current_User.ID) { // this user is sender
						returnHTML += '<p class = "message_send">';
					} // end if this user is sender
					else { // this user is receiver
						returnHTML += '<p class = "message_received">';
					}; // end else this user is receiver	
					time_string = Chatmessage_Entity.Date_Time.toLocaleTimeString().substr(0,5);				
					if (Chatmessage_Entity.Date_Time) returnHTML += time_string + ' ';
					if (Chatmessage_Entity.Webuser_Sender.Directory_ID == current_User.ID) { // message send from this user
						returnHTML += Webuser_Sender_Entity.Name + ': ';
					} // else message send from this user
					else { // message send from other user
						returnHTML += Webuser_Receiver_Entity.Name + ': ';
					}; // end else message send from other suer
					returnHTML += Chatmessage_Entity.Messagetext;
					returnHTML += '</p>';
					
					// set 'read by receiver' attribute
					if ((!Chatmessage_Entity.Read_by_Receiver) && (Chatmessage_Entity.Webuser_Receiver.Directory_ID === current_User.ID)) { // unread message send from other Webuser (this Webuser is receiver)
						Chatmessage_Entity.Read_by_Receiver = true;
						Chatmessage_Entity.save();
					}; // end if unread message send from other Webuser (this Webuser is receiver)
				}; // end for
			}; // Sender and receiver Webuser exits
		}; // end if Chatmessage_Coll exists
	}; // Session has current user and other user defined
	return returnHTML;

}).scope = 'public';
