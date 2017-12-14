import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('Server is running on port number', app.get('port'));
});