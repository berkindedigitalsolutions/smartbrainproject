const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'berkincetin',
      password : '',
      database : 'smart-brain'
    }
});

db.select('*').from('users').then(data=>{
    console.log(data);
});


// Body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//const bodyParser = require('body-parser')
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
//Get Route

app.get('/', (req,res) => {
    res.send(database.users);
})

// Sign In Post Route
app.post('/signin', (req,res) => {


    if (req.body.email ===database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Wrong username or password');   
    }
})


// Register Post Route
app.post('/register',(req,res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*')
    .insert({
        email:email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);

    })
    .catch(err =>res.status(400).json('Unable to register'))
})

// Profile Get Request

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    
    .then(user => {
        if (user.length) {
            res.json(user[0]);

        } else {
            res.status(400).json('Not found');
        }
    })
    .catch(err =>res.status(400).json('Error getting user'))

})


// Put Request to update user image count 
app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
        
    })
    if (!found) {
        res.status(400).json('User not found');
    }
})

// bcrypt.hash(password, null, null, function(err, hash) {
//     console.log(hash);
// });


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });



app.listen(3000, () => {
    console.log("App is running on port 3000");
});




/* API REQUIREMENTS

/ --> res = this is working
/signin --> POST = success/failure
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/