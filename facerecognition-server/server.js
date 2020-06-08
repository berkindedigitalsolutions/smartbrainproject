const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require('knex')


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true

    }
});



// Body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//const bodyParser = require('body-parser')

//Get Route
app.get('/', (req,res) => {
    res.send('It is working');
})

// Sign In Post Route
app.post('/signin', (req,res) => { signin.handleSignIn(req,res,db,bcrypt) });


// Register Post Route
app.post('/register',(req,res) =>{ register.handleRegister(req,res,db,bcrypt) });

// Profile Get Request

app.get('/profile/:id', (req,res) => { profile.handleProfileGet(req,res,db)} )


// Put Request to update user image count 
app.put('/image', (req,res) => { image.handleImage(req,res,db)})

//Post Request to call Clarifai API 
app.post('/imageurl', (req,res) => { image.handleApiCall(req,res)})


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});







