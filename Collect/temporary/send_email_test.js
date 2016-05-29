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
}

//create the email message
var mail = require("waf-mail/mail");
var message = new mail.Mail();
message.subject = "äöüß This is a test";
message.removeField('Content-Type');
message.addField('Content-Type', 'text/plain; charset="iso-8859-1"');
message.from = '4dlists@fuchs4d.de';
message.to = "android@fuchs4d.de";
message.setContent("Did it work?");
 
//send the email message
sendEmail({
    address: "smtp.1und1.de",
    port: 465,
    isSSL: true,
    domain: "fuchs4d.de",
    user: "4dlists@fuchs4d.de",
    password: "XXXXXXXX" // password here
}, message);
