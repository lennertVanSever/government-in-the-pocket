import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import chatLogic from './chatLogic';

const app = express();

let facebookPageToken = process.env.facebookPageToken;

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log(facebookPageToken);
	console.log('running on port', app.get('port'))
})


app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    if(messaging_events){
	    for (let i = 0; i < messaging_events.length; i++) {
	      let event = req.body.entry[0].messaging[i]
	      let sender = event.sender.id;
	      chatLogic.main(event, sender);
	    }
    }
    res.sendStatus(200)
})