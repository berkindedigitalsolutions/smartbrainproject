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

// db.select('*').from('users').then(data=>{
//     console.log(data);
// });


// Body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//const bodyParser = require('body-parser')

//Get Route

app.get('/', (req,res) => {
    res.send(db.select('*').from('users'));
})

// Sign In Post Route
app.post('/signin', (req,res) => {
    db.select('email', 'hash').from('login')
        .where('email','=',req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                .where('email','=',req.body.email)
                .then(user => {
                    res.json(user[0])

                })
                .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
})


// Register Post Route
app.post('/register',(req,res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx =>{
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email:loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
        
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
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
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'))
})

app.listen(3000, () => {
    console.log("App is running on port 3000");
});

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








/* API REQUIREMENTS

/ --> res = this is working
/signin --> POST = success/failure
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/