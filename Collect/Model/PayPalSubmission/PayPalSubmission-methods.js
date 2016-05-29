

(model.PayPalSubmission.methods.Submission_New = function(amount_submitted) {
	// Submit new Paypal transaction from Paypal button
	// return UUID of submission
	
	var result = {       // result object returned to client
		UUID: null, // new added entity ID
		error_text: '', // error text if new Webuser could not be created
		error_params: [] // error parameters for error string placeholders %1, %2
	};

	var ok_Flag = true;
	ok_Flag = !!(amount_submitted);
	if(!ok_Flag) {
		result.error_text = 'No_recharge_amount_entered';
	};
	if (ok_Flag) {
		// round to cent
		amount_submitted = amount_submitted.toString().replace(',','.');
		amount_submitted = Math.round(amount_submitted*100)/100;
		ok_Flag = (amount_submitted >= 10 && amount_submitted <= 100);
		if(!ok_Flag){
			result.error_text = 'Recharge_amount_out_of_range';
		};
	};
	
	// Create and save entity
	if(ok_Flag) {
		var PayPalSubmission_Entity = ds.PayPalSubmission.createEntity();
		PayPalSubmission_Entity.Kind = 'Submission';
		PayPalSubmission_Entity.Webuser = currentUser().ID;
		PayPalSubmission_Entity.Amount_EUR_Submitted = amount_submitted;
		PayPalSubmission_Entity.save();
		result.UUID = PayPalSubmission_Entity.UUID;
	};
	
	return result;
}).scope = 'public';


(model.PayPalSubmission.methods.Submsions_Webuser_Load = function() {
	// Load submissions for current user
	var current_User = currentUser();
	if (current_User) { // current user exists
		return ds.PayPalSubmission.query('Webuser.Directory_ID == :1 && Kind == :2 order by Date_Time_Send desc', current_User.ID, 'Submission'); 
	}; // end if current user exits	
}).scope = 'public';