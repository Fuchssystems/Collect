
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {
	this.localize = function (language_to_set) {
		language_Set_DOM_from_Object(language_to_set, locObj_Comp, $comp.id); // localize DOM from localization object
	}; // end this.localize

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'Webuser_Administration';
	// @endregion// @endlock

	this.load = function (data) {// @lock
		widget_position_restore (data.userData.prog_ID, id); // move widgets to saved positions (after dragging)

		this.localize(); // localize DOM of from localization object
		widget_Drag_Parameters_Set(data.userData.prog_ID, id); // initialize draggable widget with saved positions

		Transaction_Detail_Mode = 'disabled'; // Dialog Credit transaction Mode
		
		$$('component_Main_dataGrid_Webuser_Transactions').column('Kind').setRenderer(
			function(cell) {
				if (cell.value) { // cell has value
					return gStr_Localized_Get(('Grid_Webuser_Col_Kind_' + cell.value), locObj_Comp);
				}; // end if cell has value 
			} // end function
		); // end .setRenderer

	// @region namespaceDeclaration// @startlock
	var button_DLOG_Transaction_OK = {};	// @button
	var button_DLOG_Transaction_Cancel = {};	// @button
	var button_Transaction_New = {};	// @button
	// @endregion// @endlock

	// eventHandlers// @lock

	button_DLOG_Transaction_OK.click = function button_DLOG_Transaction_OK_click (event)// @startlock
	{// @endlock
		var val_EUR = parseFloat($$('component_Main_Transaction_Detail_EUR').getValue());
		var OK_Flag = !!val_EUR;
		if (!OK_Flag) {
			alert(gStr_Localized_Get('No_amount_entered', locStr_Admin_Webuser));
			$$('component_Main_Transaction_Detail_EUR').focus();
		}; // end if !OK_Flag
		if (OK_Flag) {
			OK_Flag = val_EUR >= -1000 && val_EUR <= 1000;
			if (!OK_Flag) {
				alert(gStr_Localized_Get('Amount_out_of_range', locStr_Admin_Webuser));
				$$('component_Main_Transaction_Detail_EUR').focus();
			}; // end if !OK_Flag
		}; // end if OK_Flag
		
		if (OK_Flag) {
			var val_Date_Received = $$('component_Main_Transaction_Detail_Date_Received').getValue();
			OK_Flag = !!val_Date_Received; 
			if (!OK_Flag) {
				alert(gStr_Localized_Get('No_receiving_date_entered', locStr_Admin_Webuser));
				$$('component_Main_Transaction_Detail_Date_Received').focus();
			}; // end if !OK_Flag 
			if(OK_Flag) {
				val_Date_Received = stringToDate_dd_mm_yy(val_Date_Received);
				OK_Flag = !!val_Date_Received; 
				if (!OK_Flag) {
					alert(gStr_Localized_Get('Invalid_date', locStr_Admin_Webuser));
					$$('component_Main_Transaction_Detail_Date_Received').focus();
				}; // end if !OK_Flag 
			}; // end if OK_Flag
			if(OK_Flag) {
				var date_today = new Date();
				var date_limit_future = new Date();
				var date_limit_past = new Date();
				date_limit_future.setTime(date_today.getTime() + (3*86400000));
				date_limit_past.setTime(date_today.getTime() - (10*86400000));
				OK_Flag = (val_Date_Received >= date_limit_past) && (val_Date_Received <= date_limit_future);
				if (!OK_Flag) {
					alert(gStr_Localized_Get('Receiving_Date_out_of_range', locStr_Admin_Webuser));
					$$('component_Main_Transaction_Detail_Date_Received').focus();
				}; // end if !OK_Flag 
			}; // end if OK_Flag
		}; // end if OK_Flag
		
		if (OK_Flag) {
			var val_Account = $$('component_Main_Transaction_Detail_Account').getValue();
			OK_Flag = !!val_Account; 
			if (!OK_Flag) {
				alert(gStr_Localized_Get('No_account_entered', locStr_Admin_Webuser));
				$$('component_Main_Transaction_Detail_Account').focus();
			}; // end if !OK_Flag 
		}; // end if OK_Flag
		
		if (OK_Flag) {
			// send to server
			var val_Comment = $$('component_Main_Transaction_Detail_Comment').getValue();
			ds.Credit_Transaction.Transaction_New ({
				onSuccess:function(event) {
					if(!event.result.error_text) { 
						sources.component_Main_webuser.collectionRefresh();
						Transaction_Detail_Mode = 'disabled';
						$$('component_Main_dialog_Transaction_Detail').closeDialog();
					}
					else {
						alert(gStr_Localized_Get(event.result.error_text, locStr_Admin_Webuser, null, event.result.error_params));
					};
				},
				onError:function(error) {
					alert('OnError sources.webuser.Modify_Username');
				}
			}, sources.component_Main_webuser.Directory_ID, val_EUR, val_Account, val_Date_Received, val_Comment); // ends.Credit_Transaction.Transaction_New
		}; // end if =K_Flag
	};// @lock

	button_DLOG_Transaction_Cancel.click = function button_DLOG_Transaction_Cancel_click (event)// @startlock
	{// @endlock
		Transaction_Detail_Mode = 'disabled';
		$$('component_Main_dialog_Transaction_Detail').closeDialog(); //cancel button
	};// @lock

	button_Transaction_New.click = function button_Transaction_New_click (event)// @startlock
	{// @endlock
		var OK_Flag = (Transaction_Detail_Mode === 'disabled');
		if (OK_Flag) {
			if (!sources.component_Main_webuser.Name) { // No Webuser selected
				alert(gStr_Localized_Get('No_Webuser_selected', locStr_Admin_Webuser));
				OK_Flag = false;
			}; // No Webuser selected
		}; // end if OK_Flag
		if (OK_Flag) {
			Transaction_Detail_Mode = 'add';
			
			var DLOG_Title = gStr_Localized_Get ('richText_DLOG_Transcation_Title', locStr_Admin_Webuser, null, [sources.component_Main_webuser.Name]); // dialog title
			$('#component_Main_richText_DLOG_Transcation_Title').html(DLOG_Title);
			
			$$('component_Main_Transaction_Detail_EUR').setValue(0);
			$$('component_Main_Transaction_Detail_Date_Received').setValue($.datepicker.formatDate('dd.mm.y',new Date()));
			$$('component_Main_Transaction_Detail_Account').setValue('Paypal');
			$$('component_Main_Transaction_Detail_Comment').setValue('');
			
			$$('component_Main_Transaction_Detail_EUR').focus();
			$$('component_Main_dialog_Transaction_Detail').displayDialog();
		}; // end if OK_Flag
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_button_DLOG_Transaction_OK", "click", button_DLOG_Transaction_OK.click, "WAF");
	WAF.addListener(this.id + "_button_DLOG_Transaction_Cancel", "click", button_DLOG_Transaction_Cancel.click, "WAF");
	WAF.addListener(this.id + "_button_Transaction_New", "click", button_Transaction_New.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
