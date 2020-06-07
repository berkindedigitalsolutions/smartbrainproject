const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const app = express();

// Body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
        res.json('Success')
    } else {
        res.status(400).json('Wrong username or password');   
    }
})


// Register Post Route
app.post('/register',(req,res) => {
    const { email, name, password } = req.body;

    database.users.push(
        {
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        },
    );
    res.json(database.users[database.users.length-1])
})

// Profile Get Request

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
        
    })
    if (!found) {
        res.status(400).json('User not found');
    }
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