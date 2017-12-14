import request from 'request';

const facebookPageToken = process.env.facebookPageToken;
const url = 'https://graph.facebook.com/v2.6/me/messages';
const qs = {access_token:facebookPageToken};

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    sendMessageDataToSender(sender, messageData);
}

function sendInitiatingMessage(sender){
	let messageData = {
	    "attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Choose a language",
				"buttons":[
				    {
					  "type": "postback",
					  "title": "English",
					  "payload": "language"
					},
				    {
					  "type": "postback",
					  "title": "Nederlands",
					  "payload": "language"
					},
					{
					  "type": "postback",
					  "title": "Français",
					  "payload": "language"
					}
				]
			}
		}
	}
	sendMessageDataToSender(sender, messageData);
}

function sendMessageDataToSender(sender, messageData){
	request({
	    url,
	    qs,
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error 62: ', response.body.error)
	    }
    });
}

module.exports = {
	main(event, sender){
		if (event.postback) {
			if(event.postback.payload === 'USER_DEFINED_PAYLOAD'){
				sendInitiatingMessage(sender);
			}
		}
		if (event.message && event.message.text) {
	  	    sendTextMessage(sender, "message received");
	    }
	}
}


