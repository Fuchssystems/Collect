Demodata
Username/password combinations:
a/a
b/b
c/c
d/d
e/e
f/f 
a is administrator (incl. google maps demo)
 
Wakanda learning project and proof-of-concept
- WebRTC-Videochat (only Chrome and Firefox)
- Websockets for chat messages(Performance)
- jqwidgets Framework integration (datagrid, menus and more)
- google maps integration
- PayPal payment notification (automated procession)
- Single Page Application (with browser history)
- User session management
- User registration with confirnment emails
- File upload (foto collection in profiles)
- Multi language support (client and server)
 
My email: fuchs@fuchs.systems
If you need software development services I am happy to hear from you

Requires wakanda enterprise v9:
http://download.wakanda.org/ProductionChannel/v9/Wakanda-Enterprise/

Necessary code editing to run on your own server
File "Collect/Collect/scripts/email_functions.js":
At the end edit the credentials of your email server and remove the server ip if-statement.
File "Collect/Collect/Webfolder/User_Payments.waComponent/User_Payments_functions.js:
Enter your Paypal data at the end: PayPal-Sandbox facilitator name und server address to receive the PayPal payment notifications.
Chrome requires a https connection to use audio/video. Therefore, you have to install your own certificate files "cert.pem" and "key.pem" in the folder
"Collect/Collect Solution/Certificates".
 
jqwidgets Non-commercial Licence
Here is the link according to the licence requirements:
jqwidgets.com