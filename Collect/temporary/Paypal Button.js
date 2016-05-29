<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="X57KU8BYXCVZ8">
<input type="image" src="https://www.paypalobjects.com/de_DE/DE/i/btn/btn_paynowCC_LG.gif" border="0" name="submit" alt="Jetzt einfach, schnell und sicher online bezahlen – mit PayPal.">
<img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
</form>

//englisch

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="U6Y7MBSDF37EG">
<input type="image" src="https://www.paypalobjects.com/en_US/DE/i/btn/btn_paynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
</form>

fuchs-facilitator_api1.fuchs4d.de
fuchs-facilitator@fuchs4d.de
L6UFE6TNKQHKSXXB
12345678

Test-Button:
<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="CD65EPVGR777S">
<input type="image" src="https://www.sandbox.paypal.com/de_DE/DE/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="Jetzt einfach, schnell und sicher online bezahlen – mit PayPal.">
<img alt="" border="0" src="https://www.sandbox.paypal.com/de_DE/i/scr/pixel.gif" width="1" height="1">
</form>

// request hander from wakanda forum



* @author admin

*/

include(solution.getFolder().path + 'script/utility.js');
include(solution.getFolder().path + 'script/md5.js');

function PayPal()
{    		
	this.version	= '63.0'
	this.env 		= 'live';
	this.serverURL	= 'https://xxxxxxxxx.com';

	this.buildRequest = function(method)
	{
		var header = '';
		
		if (this.env == 'sandbox')
		{
			header = 	'https://api-3t.sandbox.paypal.com/nvp?' + 
						'USER=xxxxxxx' +
						'&PWD=xxxxxxx' +
						'&SIGNATURE=xxxxxxxxxxxxxxx' +
						'&VERSION=' + this.version + 
						'&METHOD=' + method;	

		}
		else
		{
			header = 	'https://api-3t.paypal.com/nvp?' + 
						'USER=xxxxxxxxxx' +
						'&PWD=xxxxxxxxxx' +
						'&SIGNATURE=xxxxxxxxxxxxxx' +
						'&VERSION=' + this.version + 
						'&METHOD=' + method;			
		}
		
		return header;
	}
	
    this.setExpressCheckout = function(amount, desc, UUID)
    {
		var result = '';
		var env = this.env;
		
    	try
    	{   
    		var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() 
			{ 
				if (this.readyState == 4 && this.status == 200) 
				{				   			  		
					var responseText = decodeURIComponent(this.responseText);
					var response = getParameters(responseText);
					
					if(response['ACK'] == 'Success')
					{				
						if(env == 'sandbox')
						{
							result = 'https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=' + response['TOKEN'];	
						}
						else
						{
							result = 'https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + response['TOKEN'];
						}
					}
				}
			};	
						
			var URL = this.buildRequest('setExpressCheckout') + 
						'&PAYMENTREQUEST_0_PAYMENTACTION=Sale' +
						'&PAYMENTREQUEST_0_CURRENCYCODE=CAD' + 
						'&PAYMENTREQUEST_0_AMT=' + amount +
						'&L_PAYMENTREQUEST_0_NAME0=' + desc +
						'&L_PAYMENTREQUEST_0_AMT0=' + amount +
						'&RETURNURL=' + this.serverURL + '/userconfirm?UUID=' + UUID +
						'&CANCELURL=' + this.serverURL + '/usercancel' +						
						'&L_PAYMENTREQUEST_0_QTY0=1';
														  
			URL = encodeURI(URL); 

			xhr.open('GET',URL);   
			xhr.send();			
		}
		catch(e)
		{
			e.message;
			debugger;
		}
		
		return result;
    }
	
    
    this.doExpressCheckout = function(token, amount, payerID)
    {
    	var result = new Array(2);    	
    	    	
    	result[0] = false;    	
    	result[1] = '';  
    	    	
    	try
    	{   
    		var xhr = new XMLHttpRequest();   
    		 		
			xhr.onreadystatechange = function() 
			{ 
				if (this.readyState == 4 && this.status == 200) 
				{		   			  				
					var responseText = decodeURIComponent(this.responseText);
					var response = getParameters(responseText);

					var payment = new ds.Payment();   
					
					payment.ACK 			= response['PAYMENTINFO_0_ACK'];			       
					payment.ORDERTIME 		= response['PAYMENTINFO_0_ORDERTIME']; 
					payment.P_TRANSACTIONID = response['PAYMENTINFO_0_TRANSACTIONID']; 
					payment.AMT 			= response['PAYMENTINFO_0_AMT']; 
					payment.FEEAMT 			= response['PAYMENTINFO_0_FEEAMT']; 
					payment.CURRENCYCODE 	= response['PAYMENTINFO_0_CURRENCYCODE']; 
					payment.PAYMENTSTATUS 	= response['PAYMENTINFO_0_PAYMENTSTATUS']; 
			  		payment.PENDINGREASON 	= response['PAYMENTINFO_0_PENDINGREASON']; 
			       			       
					payment.save();     
     					
					if( response['ACK'] 						== 'Success' && 
						response['PAYMENTINFO_0_ACK'] 			== 'Success' && 
						response['PAYMENTINFO_0_PAYMENTSTATUS'] == 'Completed'
						) 
					{				
						result[0] = true;
						result[1] = response['PAYMENTINFO_0_TRANSACTIONID'];
					}					
				}
			};		

			var URL = this.buildRequest('doExpressCheckoutPayment') + 
						'&PAYMENTREQUEST_0_PAYMENTACTION=Sale' +
						'&PAYMENTREQUEST_0_CURRENCYCODE=CAD' + 
						'&PAYMENTREQUEST_0_AMT=' + amount +
						'&TOKEN=' + token +
						'&PAYERID=' + payerID;
														  
			URL = encodeURI(URL);
			
			xhr.open('GET',URL);   
			xhr.send();			
		}
		catch(e)
		{
			e.message;
			debugger;
		}
		
		return result;
    }
    
    this.refundTransaction = function(transactionID)
    {
    	var result = false;
    		
		try
    	{   
    		var xhr = new XMLHttpRequest();   
    		 		
			xhr.onreadystatechange = function() 
			{ 
				if (this.readyState == 4 && this.status == 200) 
				{												
					var responseText = decodeURIComponent(this.responseText);
					var response = getParameters(responseText);
					
					var payment = ds.Payment.find("P_TRANSACTIONID = :1", transactionID); 
										
					payment.REFUNDTRANSACTIONID 	= response['REFUNDTRANSACTIONID'];			       
					payment.FEEREFUNDAMT 			= response['FEEREFUNDAMT']; 
					payment.GROSSREFUNDAMT 			= response['GROSSREFUNDAMT']; 
					payment.NETREFUNDAMT 			= response['NETREFUNDAMT']; 
		       
					payment.save();	
					
					if(response['ACK'] == 'Success') 
					{				
						result = true;
					}													   			  																	
				}
			};		

			var URL = this.buildRequest('RefundTransaction') + '&TRANSACTIONID=' + transactionID;
														  
			URL = encodeURI(URL);
	    				
			xhr.open('GET',URL);   
			xhr.send();			
		}
		catch(e)
		{
			e.message;
		}
		
		return result;    	
    }
}
