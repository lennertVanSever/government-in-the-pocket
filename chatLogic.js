import request from 'request';

const facebookPageToken = process.env.facebookPageToken;
const url = 'https://graph.facebook.com/v2.6/me/messages';
const qs = {access_token:facebookPageToken};

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    sendMessageDataToSender(sender, messageData);
}

function chooseLanguageMessage(sender){
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

function chooseCountryMessage(sender){
	let messageData = {
	    "attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Kies jouw land",
				"buttons":[
				    {
					  "type": "postback",
					  "title": "Nederland",
					  "payload": "country"
					},
				    {
					  "type": "postback",
					  "title": "België",
					  "payload": "country"
					},
					{
					  "type": "postback",
					  "title": "Frankrijk",
					  "payload": "country"
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
			const { payload } = event.postback;
			switch(payload) {
			    case 'USER_DEFINED_PAYLOAD':
			        chooseLanguageMessage(sender);
			        break;
			    case 'language':
			        chooseCountryMessage(sender);
			        break;
			    default:
			        console.log("payload not found", payload);
			}
		}
		if (event.message && event.message.text) {
	  	    sendTextMessage(sender, "message received");
	    }
	}
}


