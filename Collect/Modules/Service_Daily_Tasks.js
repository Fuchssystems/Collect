/*	The helloWorld() function can be executed from any of your project's server-side JavaScript file using the require() method as follows:
	var result = require('Service_Daily_Tasks').helloWorld();

	For more information, refer to http://doc.wakanda.org/Wakanda Studio0.Beta/help/Title/en/page3355.html
*/

// Service to start Shared worker Dail_Tasks.js

exports.postMessage = function (message) {

	if (message.name === 'applicationWillStart') {
		/* 	This is the first message sent to the service.
			It's a good location to initialize and start the service */
		var theWorker = new SharedWorker("Workers/Daily_tasks.js", "Daily_Tasks");

	}
	else if (message.name === 'applicationWillStop') {
		/*	The service should be stopped and ended here */
	}
	else if (message.name === 'httpServerDidStart') {
		/*	This message should be handled if the service depends on the HTTP Server status */

	}
	else if (message.name === 'httpServerWillStop') {
		/*	This message should be handled if the service depends on the HTTP Server status */
	}
	else if (message.name === 'catalogWillReload') {
		/*	This message should be handled if the service depends on the Model and uses the 'ds' property */
	}
	else if (message.name === 'catalogDidReload') {
		/*	This message should be handled if the service depends on the Model and uses the 'ds' property */
	}	
};