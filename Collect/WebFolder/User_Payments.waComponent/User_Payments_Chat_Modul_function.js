// functions for Chatmodule in component User_Payments

var url = ''; // url for websocket
if (window.location.protocol == 'https:') { // https protocol
	url = 'wss://';
} // end if https protocol
else { // http protocol
	url = 'ws://';
}; // end else http protocol
url += window.location.host + '/chat';

var ws = new WebSocket(url); //logging in the webworker.  /chat is the path which matches the path of the  WebSocketHandler in bootstrap.js

ws.onmessage = function (event) {
	var data = JSON.parse(event.data); 
	if (data.kind) {
		switch (data.kind) {
			case 'new_confirmed_payment':
				load_source_credit_Transaction (); // load local datasoruce credit_Transaction
				break;
			}; // end switch
	}; // end if
};

ws.onopen = function () {
	var obj_to_send = {
		kind: 'open',
		user_ID: WAF_directory_currentUser.ID
	}; // end var obj_to_send
	ws.send(JSON.stringify(obj_to_send));
};
