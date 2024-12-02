const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

let cachedClient;
let cachedDb;

async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}

	const client = new MongoClient(uri);
	await client.connect();
	const db = client.db('odontograma');

	cachedClient = client;
	cachedDb = db;

	return { client, db };
}

export default connectToDatabase;
