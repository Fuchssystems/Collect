// server functions related to email
// you need to enter your email account and password below
// and add the ip address of your email server

// send email with smtp authentification
// for use with provider 1&1
// copied from wakanda forum (from username welsh)
function sendEmail(config, message) {
    "use strict";
 
    var smtp = require("waf-mail/smtp"),
        client,
        errName,
        errInfo,
        isSent;
 
    //init error tracking
    errName = "";
    errInfo = [];
 
    //connect
    client = new smtp.SMTP();
    client.connect(config.address, config.port, config.isSSL, config.domain, function onAfterConnect(isConnected, replyArr, isESMTP) {
        if (isConnected) {
 
            //authenticate
            client.authenticate(config.user, config.password, function onAfterAuthenticate(isAuthenticated, replyArr) {
                if (isAuthenticated) {
 
                    //send
                    client.send(message.from, message.to, message, function onAfterSend(isSent, replyArr) {
                        if (isSent) {
                            exitWait();
                        } else {
                            errName = "smtp_SendFailed";
                            errInfo = replyArr;
                            exitWait();
                        }
                    });
                } else {
                    errName = "smtp_AuthFailed";
                    errInfo = replyArr;
                    exitWait();
                }
            });
        } else {
            errName = "smtp_CouldNotConnect";
            errInfo = replyArr;
            exitWait();
        }
    });
    wait();
 
    //determine if sent
    if (errName === "") {
        isSent = true;
    } else {
        isSent = false;
    }
 
    //return if sent and any error info
    return {
        isSent: isSent,
        errName: errName,
        errInfo: errInfo
    };
};

var send_email = function (message_to_send) {
	message_to_send.from = 'webmaster@efee.de';
	var param_Obj = {}; // Server parameters
	if (httpServer.ipAddress === '81.169.167.138') { // running on Strato-Server
	    param_Obj.address = "smtp.strato.de";
	    param_Obj.port = 465;
	    param_Obj.isSSL = true;
	    param_Obj.domain = "efee.de";
	    param_Obj.user = "webmaster@efee.de";
	    param_Obj.password = "XXXXXXXX1"; // password here
	} // end if running on Strato-Server
	else { // local developer machine
		param_Obj.address = "smtp.1und1.de",
	    param_Obj.port = 465;
	    param_Obj.isSSL = true;
	    param_Obj.domain = "fuchs4d.de";
	    param_Obj.user = "4dlists@fuchs4d.de";
	    param_Obj.password = "XXXXXXXX"; // password here
	}; // end else local developer machine
	sendEmail(param_Obj, message_to_send);
}; // end var send_email

