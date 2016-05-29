// dedicated worker to perform tasks every 24h

// delete unconfirmed registrations after more than 1 day after last confirmation-link email was send
 
function remove_unconfirmed_registrations()
{	
	var Webuser_Coll = ds.Webuser.query('Registration_Pending == true');
	Webuser_Coll.forEach(
		function (Webuser_Entity) {	
			var Remove_Flag = false;
			Send_Email_Coll = ds.Send_Email.query('Webuser.Directory_ID == :1 && Kind == :2 order by Date_Send desc', Webuser_Entity.Directory_ID, 'Request_Confirmation');
			Remove_Flag = (Send_Email_Coll.length > 0);
			if (Remove_Flag) {
				var Time_Diff = new Date() - Send_Email_Coll[0].Date_Send;
				Remove_Flag = Time_Diff > (86400*1000) // remove if last unconfirmed email is older than 1 day
			}; // end if Remove_Flag			
			if (Remove_Flag) Webuser_Entity.remove();
		} // end .forEach
	); // end .forEach
	
} // end function remove_unconfirmed_registrations
 
onconnect = function(msg)
{
    var thePort = msg.ports[0];    
    tmKey += 1;
    tmConnections[tmKey] = thePort;
    thePort.onmessage = function(event)
    {
        var message = event.data;
        var fromPort = tmConnections[message.ref];
        switch (message.type)
        {
            case 'report':  //  parent asking for time of last backup
                if (tmError!= 0)
                {
                    fromPort.postMessage({type: 'error', errorCode: tmError });
                    close();  //  shut down SharedWorker thread if error encountered
                }
                else
                {
                    fromPort.postMessage({type: 'update', count: tmCount, lastBackup: tmLastBackup});
                }
                break;

            case 'disconnect':
                tmConnections[message.ref] = null;
                break;
        }
    }
    thePort.postMessage({type: 'connected', ref: tmKey});
}
 
var tmCount = 0;
var tmLastBackup = 'Awaiting first backup ... ';
var tmKey = 0;
var tmError = 0;
var tmConnections = [];
             
remove_unconfirmed_registrations();  //  Initial run
setInterval(remove_unconfirmed_registrations, 86400 * 1000 * 3) //  Perform removal process every 24 hours
//  Note that setInterval() does not initiate the first function call until after the specified interval passes
 