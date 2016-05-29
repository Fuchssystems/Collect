
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
		// localize PayPal image button
		var Paypal_button_src_URL = gStr_Localized_Get('PayNow_Image_URL', locStr_Payments);
		$("#component_Main_imageButton_Paypal .waf-icon-state1").attr("src", Paypal_button_src_URL);
		$("#component_Main_imageButton_Paypal .waf-icon-state2").attr("src", Paypal_button_src_URL);
		$("#component_Main_imageButton_Paypal .waf-icon-state3").attr("src", Paypal_button_src_URL);
		$("#component_Main_imageButton_Paypal .waf-icon-state4").attr("src", Paypal_button_src_URL);
		$('#component_Main_imageButton_Paypal').width(gStr_Localized_Get('PayNow_Button_Width',locStr_Payments)); // button width
		$('#component_Main_icon2').width(gStr_Localized_Get('PayNow_Button_Width',locStr_Payments)); // icon width
	}; // end this.localize
	
	this.unload = function() { // to be called on component.remove()
		if (ws) ws.close(1000); // close websocket connection
	}; // end this.unload()

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'User_Payments';
	// @endregion// @endlock

	this.load = function (data) {// @lock
	
	this.localize(); // localize DOM of from localization object

	load_source_credit_Transaction (); // load local datasoruce credit_Transaction
	load_source_PayPalSubmissions (); // load local datasource PayPalSubmissions

	// @region namespaceDeclaration// @startlock
	var imageButton_Paypal = {};	// @buttonImage
	// @endregion// @endlock

	// eventHandlers// @lock

	imageButton_Paypal.click = function imageButton_Paypal_click (event)// @startlock
	{// @endlock
		var ok_Flag = true;
		var id_recharge_amount = getHtmlId('textField_Recharge_Amount');
		var val_recharge_amount = $$(id_recharge_amount).getValue();
		ok_Flag = val_recharge_amount !== null;
		if(!ok_Flag){
			alert(gStr_Localized_Get('No_recharge_amount_entered', locStr_Payments));
			ok_Flag = false;
			$$(id_recharge_amount).focus();
		};
		
		// round to cent
		if (ok_Flag) {
			val_recharge_amount = val_recharge_amount.replace(',','.');
			val_recharge_amount = Math.round(val_recharge_amount*100)/100;
			$$(id_recharge_amount).setValue(val_recharge_amount);
		};
		
		if(ok_Flag) {
			ok_Flag = (val_recharge_amount >= 10 && val_recharge_amount <= 100);
			if(!ok_Flag){
				alert(gStr_Localized_Get('Recharge_amount_out_of_range', locStr_Payments));
				ok_Flag = false;
				$$(id_recharge_amount).focus();
			};
		}; // ok_Flag
		
		if(ok_Flag) {
			PayPal_Button_Submit(val_recharge_amount);
		};
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_imageButton_Paypal", "click", imageButton_Paypal.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
