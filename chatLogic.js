import request from 'request';

const facebookPageToken = process.env.facebookPageToken;
const url = 'https://graph.facebook.com/v2.6/me/messages';
const qs = {access_token:facebookPageToken};

function sendTextMessage(sender, text) {
    let messageData = { text:text }
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

function askInfoOrAction(sender){
	let messageData = {
	    "attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Welkom bij de Belgische overheid 🇧🇪. Wil je info of een adminstratieve taak uitvoeren?",
				"buttons":[
				    {
					  "type": "postback",
					  "title": "info",
					  "payload": "typeOfAction"
					},
				    {
					  "type": "postback",
					  "title": "adminstratieve taak",
					  "payload": "typeOfAction"
					}
				]
			}
		}
	}
	sendMessageDataToSender(sender, messageData);
}

function askLogin(sender){
	let messageData = {
	    "attachment":{
			"type":"template",
			"payload":{
				"template_type":"button",
				"text":"Voordat je kan beginnen moet je inloggen zodat we zeker weten dat je echt bent.",
				"buttons":[
				    {
					  	"type":"web_url",
					    "url":"https://government-in-the-pocket.herokuapp.com",
					    "title":"Login bij de Belgische overheid",
					    "webview_height_ratio": "full",
					    "messenger_extensions": true,
					}
				]
			}
		}
	}
	sendMessageDataToSender(sender, messageData);
}

module.exports = {
	main(event, sender){
		if (event.postback) {
			const { payload, title } = event.postback;
			switch(payload) {
			    case 'USER_DEFINED_PAYLOAD':
			        chooseLanguageMessage(sender);
			        break;
			    case 'language':
			        chooseCountryMessage(sender);
			        break;
			   	case 'country':
			        askInfoOrAction(sender);
			        break;
			    case 'typeOfAction':
			    	if(title === "adminstratieve taak"){
			    		askLogin(sender);
			    	}
			    	else if(title === "info"){
			    		sendTextMessage(sender, "Tip gewoon je vraag in en ik (🤖) zal proberen te helpen.")
			    	}
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


