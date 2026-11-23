//Imports: express, dors and mongodb
import express from 'express';
import cors from 'cors'
import { MongoClient } from 'mongodb';

//Static files middleware imports and definiton
import path from 'path';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

//array of lessons
const lessons = [
    {
        //Drama
        id: 1,
        image: "Images/StudentImage-Dram.jpg", 
        subject: "Drama",
        location: "Hendon, Building C, Room C122",
        price: 15,
        spaces: 5,
        description: "Drama classes are designed to improve students' acting skills, build confidence and express themselves creatively."
    },
    {
        //Science
        id: 2,
        image: "Images/StudentImage-Sci.jpg",
        subject: "Science",
        location: "Hendon, Building H, Room H222",
        price: 25,
        spaces: 5,
        description: "Science classes are designed to improve students' understanding about biology, chemistry and physics and develop analytical skills."
    },
    {
        //Art
        id: 3,
        image: "Images/StudentImage-Art.jpg",
        subject: "Art",
        location: "Hendon, Building H, Room H014",
        spaces: 5,
        price: 20,
        description: "Art classes are designed to let students express and improve their creativity through painting, drawing, pottery and other art forms."
    },
    {
        //Computer Science
        id: 4,
        image: "Images/StudentImage-Comp.jpg",
        subject: "Computer Science",
        location: "Colindale, Building C, Room C106",
        spaces: 5,
        price: 10,
        description: "Computer Science classes are designed to improve students' programming skills, problem-solving ability and understanding of algorithms."
    },
    {
        //Sports
        id: 5,
        image: "Images/StudentImage-Sport.jpg",
        subject: "Sports",
        location: "Colindale, Astrostadium, All Pitches",
        spaces: 5,
        price: 10,
        description: "Sports classes are designed to improve students' physical fitness, teamwork and sportsmanship through various sport activities."
    },
    {
        //Culinary Arts
        id: 6,
        image: "Images/StudentImage-Culin.jpg",
        subject: "Culinary Arts",
        location: "Colindale, Building H, Room H233",
        spaces: 5,
        price: 10,
        description:"Culinary Art classes are designed to improve students' cooking and baking skills, creativity and understanding of food science."
    },
    {
        //Dance
         id: 7,
        image: "Images/StudentImage-Dance.jpg",
        subject: "Dance",
        location: "Edgeware, Building R, Room R011",
        spaces: 5,
        price: 10,
        description: "Dance classes are designed to let student express themselves through various dance forms, improve their technique and build confidence."
    },
    {
        //Carpentry
        id: 8,
        image: "Images/StudentImage-Carp.jpg",
        subject: "Carpentry",
        location: "Edgeware, Building H, Room H011",
        spaces: 5,
        price: 15,
        description: "Carpentry classes are designed to improve students' woodworking skills, creativity or practical skills and understanding of contrusction techniques."
    },
    {
        //Fashion Design
        id: 9,
        image: "Images/StudentImage-Fash.jpg",
        subject: "Fashion Design",
        location: "Brent Cross, Building R, Room R022",
        spaces: 5,
        price: 25,
        description: "Fashion design classes are designed to improve students' creativity, sewing skills and undertstanding of fashion trends and techniques."
    },
    {
        //Textiles
        id: 10,
        image: "Images/StudentImage-Text.jpg",
        subject: "Textiles",
        location: "Brent Cross, Building R, Room R025",
        spaces: 5,
        price: 20,
        description: "Textile classes are designed to improve students' understanding of materials, creativity and sewing skills through various techniques."
    }
];

//GET: 10 Lessons with their information inside database
app.get('/lessons/M01023728', async (req, res) => {

    try {
        //lessons array inside database
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
        const order = req.body;

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
        const lessonId = parseInt(req.params.id);

        const updateData = req.body;

        await db.collection('lessons')
        .updateOne( { _id: lessonId }, {$set: updateData} );

        res.json({
            success: true
        });

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
});