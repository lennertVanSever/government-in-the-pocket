import { Mongoose, Schema } from 'mongoose';


const { ObjectId } = Schema;
const database = new Mongoose();

const database_url = 'mongodb://lennert:DigitizeGovernment@ds141766.mlab.com:41766/government-in-the-pocket';
if (!database_url) {
  throw new Error('You must provide a MongoLab URI');
}

database.Promise = global.Promise;
database.connect(database_url);
database.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

const citizensSchema = database.Schema({
	first_name: String,
	last_name: String,
	profile_pic: String,
	facebook_id: Number,
  registration_number: Number,
	language: ObjectId,
	government: ObjectId
}, { collection: 'citizens' });
const citizens = database.model('citizens', citizensSchema);

export {citizens};
