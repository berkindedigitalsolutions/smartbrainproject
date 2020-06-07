const express = require('express');

const app = express();

//Get Route

app.get('/', (req,res) => {
    res.send('This is working');
})

app.post('/signin', (req,res) => {
    res.send("signing in");
})

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