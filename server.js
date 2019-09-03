const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'In@!2...',
        database: 'smart-brain'
    }
});

const register = require('./controllers/register');

const signin = require('./controllers/signin');

const image = require('./controllers/image');

app.use(bodyParser.json());

app.use(cors());

app.post('/signin', (req, res)=> { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', register.handleRegister(db, bcrypt))


app.get('/profile/:id', (req, res)=> {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users')
    .where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('User not found')
        } 
    })
        .catch(err => res.status(400).json('ERROR GETTING USER.'))   
    
})

app.put('/image', (req, res)=> { image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})


/*
/ --> response = this is working.
/signin -->          POST -- success/fail
/register -->        POST -- {newUser}
/profile/:userId --> GET -- user
/image   -->         PUT -- user
*/