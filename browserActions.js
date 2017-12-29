import querystring from 'querystring';
import { citizens } from './database/Mongo';

module.exports = function (app) {
  app.post('/browserAction/postRegisterNumber', function(request, result) {
    const {registration_number, facebook_id} = request.body;
    if(facebook_id){
      citizens.find({facebook_id}).then(citizenData => {
        if(citizenData.length > 0){
          citizens.update({facebook_id}, {registration_number}).then(test => {
            result.end(`{"status": "succes", "message": "registernumber updated"}`);
          })
        }
        else{
          result.end(`{"status": "error", "message": "citizen not found"}`);
        }
      })
    }
    else{
      result.end(`{"status": "error", "message": "incorrect fb ID"}`);
    }
	})
}
