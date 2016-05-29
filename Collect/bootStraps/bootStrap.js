// custom Login listener (defined in required.js next to solution
directory.setLoginListener('loginListener', 'Admin');

// Websocket Chat
httpServer.addWebSocketHandler("/chat", "Workers/Chat_Worker.js", "chat", true);
//"/chat" is the incoming WebSocket URL
// "Chat_Worker.js" is the script file of the worker
// "chat" is the local name of the WebSocket 
// true means a shared worker

// add HTTP request handler for PayPal IPN messages
addHttpRequestHandler(
      '/\PayPal_IPN',               // (string) regex used to filter the requests to be intercepted
      'HTTPRequestHandlers/PayPal_IPN.js',  // (string) name of the file where the request handler function is specified
      'PayPal_IPN_Handler'         // (string) name of the request handler function
);