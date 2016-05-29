

(model.Credit_Transaction.methods.Transaction_New = function(Webuser_Benefit_ID, EUR_Received, Account_Received, Date_Payment_Received, Comment_Received) {
	// New Credit Transaction
	var result = {       // result object returned to client
		entity: null, // new added entity
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};
			
	var ok_Flag = true;
	ok_Flag = !!(Webuser_Benefit_ID);
	if (ok_Flag) {
		var Webuser_Entity = ds.Webuser.find('Directory_ID == :1', Webuser_Benefit_ID);
		ok_Flag = !!(Webuser_Entity);
	};
	if(!ok_Flag) {
		result.error_text = 'Invalid_Webuser';
	};
	
	if (ok_Flag) {
		ok_Flag = ((EUR_Received >= 1 && EUR_Received <= 1000) || (EUR_Received <= -1 && EUR_Received >= -1000));
		if (!ok_Flag) result.error_text = 'Amount_out_of_range';
	};
	
	if (ok_Flag) {
		ok_Flag = !!Date_Payment_Received;
		if (!ok_Flag) result.error_text = 'Invalid_date';
	};
	if (ok_Flag) {
		var date_received = isoToDate(Date_Payment_Received);
		var date_limit_future = new Date();
		var date_limit_past = new Date();
		date_limit_future.setTime(date_received.getTime() + (3*86400000));
		date_limit_past.setTime(date_received.getTime() - (10*86400000));
		ok_Flag = (date_received >= date_limit_past) && (date_received <= date_limit_future);
		if (!ok_Flag) result.error_text = 'Receiving_Date_out_of_range';
	};	
				
	if (ok_Flag) {
		ok_Flag = !!Account_Received;
		if (!ok_Flag) result.error_text = 'No_account_entered';
	};
	
	// Create and save entity
	if(ok_Flag) {
		var Credit_Transaction_Entity = ds.Credit_Transaction.createEntity();
		Credit_Transaction_Entity.Kind = 'Payment';
		Credit_Transaction_Entity.Date_Time_Entered = new Date();
		Credit_Transaction_Entity.Webuser = Webuser_Entity;
		Credit_Transaction_Entity.Authorized_by_Webuser = currentSession().user.ID;
		Credit_Transaction_Entity.Amount_of_Credits = Math.round(EUR_Received * 4);
		Credit_Transaction_Entity.Account = Account_Received;
		Credit_Transaction_Entity.Comment = Comment_Received;
		Credit_Transaction_Entity.EUR = EUR_Received;
		Credit_Transaction_Entity.Date_Time_Payment_Received = Date_Payment_Received;
		Credit_Transaction_Entity.save();
		
		// notify User via Websocket
		// send notification to receiver client via webworker
		var worker = new SharedWorker("Workers/Chat_Worker.js", "chat");
		if (worker) { // webworker exists
			var obj_to_send = {
				kind: 'new_paymment_confirmation',
				receiver_Webuser_ID: Webuser_Entity.Directory_ID
			}; // end var obj_to_send
			worker.port.postMessage(JSON.stringify(obj_to_send));
		}; // end if webworker exists
	};
	
	return result;
}).scope = 'public';


(model.Credit_Transaction.methods.Transactions_Webuser_Load = function() {
	var current_User = currentUser();
	if (current_User) { // current user exists
		return ds.Credit_Transaction.query('Webuser.Directory_ID == :1 && Kind == :2 order by Date_Time_Entered desc', current_User.ID, 'Payment'); 
	}; // end if current user exits	
}).scope = 'public';
