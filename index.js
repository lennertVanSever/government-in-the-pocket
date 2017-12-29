import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import cors from 'cors';

const app = express();

let facebookPageToken = process.env.facebookPageToken;

app.set('port', (process.env.PORT || 5000));

const whitelist = ['http://localhost:3000', 'https://government-client.herokuapp.com', undefined];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {

	res.send('Hello world, I am a chat bot')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log(facebookPageToken);
	console.log('running on port', app.get('port'))
})

require('./chatLogic.js')(app);
require('./browserActions.js')(app);
