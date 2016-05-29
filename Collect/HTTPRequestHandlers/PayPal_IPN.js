// HTTP Request Handler for PayPal IPN messages

// Request handler function specified in addHttpRequestHandler in bootstrap 
var PayPal_IPN_Handler = function (request, response) {
	// By default, the status 200 (OK) is returned.
	// send notification to receiver client via webworker
	var worker = new SharedWorker("Workers/Chat_Worker.js", "chat");
	if (worker) { // webworker exists
		var obj_to_send = {
			kind: 'new_PayPal_IPN_Notification',
			PayPal_request_body: request.body.toString('utf-8')
		}; // end var obj_to_send
		worker.port.postMessage(JSON.stringify(obj_to_send));
	}; // end if webworker exists
}; // end var PayPal_IPN_Handler
