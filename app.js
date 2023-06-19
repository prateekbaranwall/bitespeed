const express = require('express')
const cors = require('cors');
const db = require('./database');
const app = express();
const dotenv=require('dotenv');
dotenv.config();

app.use(cors());

app.get('/', (req, res) => {
  console.log(db);
  res.send('hello world')
})

app.post('/identity', (req,res) => {
    const { email, phoneNumber } = req.body;
    if(!email && !phoneNumber) {
        return res.status(400).send({
            message: 'This is an error!'
         });
    }
    console.log(email, phoneNumber);
})

app.listen(3000, ()=> {
    console.log("listening to 3000");
})