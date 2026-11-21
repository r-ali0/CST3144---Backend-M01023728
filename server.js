import express from 'express';
import cors from 'cors'
import {MongoClient} from 'mongodb';

const app = express();

app.use(cors());
app.use(express.json());

const client = newMongoClient ('mongodb://localhost:27017/');

app.listen(3000, () => {
    console.log('Server running on port 3000');
});