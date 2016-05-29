﻿/*	In order to make the helloWorld() function available client-side, you have to add a reference to the 'Chat' module in the GUI Designer.
	The helloWorld() function can be executed from your JS file as follows:
	alert(Chat.helloWorld());
	
	For more information, refer to http://doc.wakanda.org/Wakanda0.Beta/help/Title/en/page1516.html
*/
exports.rpcSendMessage = function rpcSendMessage (message) {
	var worker = new SharedWorker("Workers/Chat_Worker.js", "chat");
	worker.port.postMessage(message);
	return true;
};