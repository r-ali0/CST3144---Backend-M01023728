//Imports: express, dors and mongodb
import express from 'express';
import cors from 'cors'
import { MongoClient } from 'mongodb';

//Static files middleware imports and definiton
import path from 'path';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

//express server
const app = express();

//Using cors and reads the json format
app.use(cors());
app.use(express.json());

//Middleware Logger = records time, route method and its url
//and responses/requests
app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()}  
        ${req.method} 
        ${req.url}`);

        //Passes control to the next handler or middleware
        next();
});

//Static files middleware
app.use('/images', express.static(path.join(__dirname, '/Images')))

//mongodb server connection string
const client = new MongoClient ('mongodb://localhost:27017/');

//GET: returning Enrolment Number
app.get('/enrolment/M01023728/:lessonid', async (req, res) => {

    try {

        //Lesson Id and database definition
        const lessonId = parseInt(req.params.lessonid);
        const db = client.db('lessonsDB');

        //looks for the lesson within the database collection
        const lesson = await db.collection('lessons')
                       .findOne({ id: lessonId });

        //if lesson does not exist return 404 which shows it doesnt exist
        if (!lesson) {
            return res.status(404).json({
                error:'Lesson not found'
            });
        }

        //if enrolment is successful it returns the id and enrolment number
        //takes away the amount of spaces if people enrolled
        const enrolment = 5 - lesson.spaces;
        res.json({
            lessonId,
            enrolment
        });

        //Error response
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get Enrolment Number'
        });
    }
});


//GET: searching lesson by attribute
app.get('/search/M01023728', async (req, res) => {

    try {

        //database and search query definition
        const db = client.db('lessonsDB');
        const searchTerms = req.query.q;

        //Lesson queries for location, subject, price and spaces
        const lessons = await db.collection('lessons')
                .find({
                    $or: [
                            { 
                                //subject
                                subject: {
                                $regex: searchTerms, $options: 'i'
                            }},
                            { 
                                //location
                                location: {
                                $regex: searchTerms, $options: 'i'
                            }},
                            {
                                //price into string
                                $expr: { $regexMatch: {
                                    input: { $toString: '$price' }, regex: searchTerms
                                }}
                            },
                            {
                                //spaces into string
                                $expr: { $regexMatch: {
                                    input: { $toString: '$spaces' }, regex: searchTerms
                                }}
                            
                            }
                        ]
                        }).toArray();


        //Success, returns lesson query                
        res.json(lessons);  
     
        //Error response
    } catch (error) {
        res.status(500).json({
            error: 'Search failed'
        });
    }
});

//GET: 10 Lessons with their information inside database
app.get('/lessons/M01023728', async (req, res) => {

    try {
        //Database
        const db = client.db('lessonsDB');

        //shows me the amount of documents inside DB and console
        const count = await db.collection('lessons').countDocuments();
        console.log('Documents in lessons:', count);

        //lessons collection
        const lessons = await db.collection('lessons')
        .find({})
        .toArray();

        //if successful responds with lessons
        res.json(lessons);


      //Error response
    } catch (error) {

        //Send status and error message
        res.status(500).json({
            error: 'Failed to retrieve lessons'
        });
    }
});

//POST: orders that were made and posted inside database
app.post ('/orders/M01023728', async (req, res) => {

    try {

        //orders and database definition
        const order = req.body;
        const db = client.db('lessonsDB')

        //orders database
        await db.collection('orders').insertOne(order);

        //if successful responds with orders
        res.json(order);

      //Error response
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to save order'
        });
    }
});

//PUT: updating lesson attributes e.g spaces
app.put('/lessons/M01023728/:id', async (req, res) => {

    try {

        //defines lesson id for updating and Database
        const lessonId = parseInt(req.params.id);
        const db = client.db('lessonsDB')

        //Updates lesson attributes inside the database
        const updateData = req.body;

        const result = await db.collection('lessons')
        .updateOne( { id: lessonId }, {$set: updateData} );

        console.log(result);
        
        //Success response gives result
        res.json(result)
    
        //Error
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update data'
        });
    }
});

//Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
})