// functions component User_Payments

// load local datasoruce credit_Transaction
var load_source_credit_Transaction = function () {
	sources.component_Main_credit_Transaction.Transactions_Webuser_Load (
		{ // options
			onSuccess: function (event) {
				if (event.result) {
					sources.component_Main_credit_Transaction.setEntityCollection(event.result);
				}; // end if event.result
			}, // end onSuccess
			onError: function (error) {
				alert('onError sources.component_Main_credit_Transaction.Transactions_Webuser_Load');
			} // end onError
		} // end options
	); // end .Transactions_Webuser_Load()
}; // end var load_source_credit_Transaction

// load local datasource PayPalSubmissions
var load_source_PayPalSubmissions = function () {
	sources.component_Main_payPalSubmission.Submsions_Webuser_Load (
		{ // options
			onSuccess: function (event) {
				if (event.result) {
					sources.component_Main_payPalSubmission.setEntityCollection(event.result);
				}; // end if event.result
			}, // end onSuccess
			onError: function (error) {
				alert('onError sources.component_Main_payPalSubmission.Submsions_Webuser_Load');
			} // end onError
		} // end options
	); // end .Submsions_Webuser_Load()
}; // end var load_source_PayPalSubmissions

// submit PayPalSubmissions
var PayPal_Button_Submit = function (amount_to_submit) {
	sources.component_Main_payPalSubmission.Submission_New (
		{ // options
			onSuccess: function (event) {
				if (event.result.UUID) {
					// prepare PayPal Submit Button using POST
					var path = 'https:\/\/www.sandbox.paypal.com/cgi-bin/webscr';
					var param_Obj = {};
					param_Obj.cmd = '_xclick';
					param_Obj.business = '12345-facilitator@12345d.de'; //your paypal-Sandbox facilitator here
					//param_Obj.hosted_button_id = 'CD65EPVGR777S';
					param_Obj.currency_code = 'EUR';
					param_Obj.amount = amount_to_submit;
					param_Obj.item_name = gStr_Localized_Get('Paypal_Para_item_name', locStr_Payments);
					//param_Obj.item_number = event.result.UUID;
					param_Obj.custom = event.result.UUID;
					//param_Obj.quantity = Math.round(amount_to_submit*4);
					param_Obj.no_shipping = 1; // do not prompt for an address
					param_Obj.no_note = 1; // hide the text box and prompt
					// your server name receiving the paypal notifications here
					param_Obj.xreturn = 'http://12345.computer/' + 'PayPal_return_OK'; // will be replaced with param_Obj.return
					param_Obj.cancel_return = 'http://fuchs.computer';
					
					post_form(path,param_Obj); // submit form
					
					load_source_PayPalSubmissions(); // rebuild datasource
				}; // end if event.result.entity.ID
			}, // end onSuccess
			onError: function (error) {
				alert('onError sources.component_Main_payPalSubmission.Submission_New');
			} // end onError
		}, // end options
		amount_to_submit // parameters
	); // end .Submission_New()
}; // end var PayPal_Button_Submit
