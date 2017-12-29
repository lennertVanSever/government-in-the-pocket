import request from 'request';
import axios from 'axios';

import { citizens } from './database/Mongo';


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
		    console.log('Error: ', response.body.error)
	    }
    });
}

function getProfileData(sender){
	axios.get(`https://graph.facebook.com/v2.6/${sender}?fields=first_name,last_name,profile_pic&access_token=${facebookPageToken}`).then(response => {
		const {first_name, last_name, profile_pic, id} = response.data;
		citizens.find({facebook_id: id}).then(citizenData => {
			if(citizenData.length === 0){
				citizens.create({first_name, last_name, profile_pic, facebook_id: id});
			}
		});
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
				"buttons":[{
			  	"type":"web_url",
			    "url":`https://government-client.herokuapp.com/forms/login/${sender}`,
			    "title":"Login",
			    "webview_height_ratio": "compact",
			    "messenger_extensions": true,
        }]
			}
		}
	}
	sendMessageDataToSender(sender, messageData);
}

function handleMessengerWebHookCall(event, sender){
  console.log(`Sender: ${sender}`);
  if (event.postback) {
    const { payload, title } = event.postback;
    switch(payload) {
        case 'USER_DEFINED_PAYLOAD':
            getProfileData(sender);
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

module.exports = function (app) {
  // for Facebook verification
  app.get('/webhook/', function (req, res) {
  	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
  		res.send(req.query['hub.challenge'])
  	}
  	res.send('Error, wrong token')
  })

  app.post('/webhook/', function (req, res) {
    console.log(req.toString());
    let messaging_events = req.body.entry[0].messaging;
    if(messaging_events){
      for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;
        handleMessengerWebHookCall(event, sender);
      }
    }
    res.sendStatus(200)
  });
}
