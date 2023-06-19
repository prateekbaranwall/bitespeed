const express = require('express')
const cors = require('cors');
const db = require('./database');
const app = express();
const dotenv=require('dotenv');
const bodyParser = require('body-parser')
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/identity', async(req,res) => {
    console.log(req.body);
    const { email, phoneNumber } = req.body;
    if(!email && !phoneNumber) {
        return res.status(400).send({
            message: 'This is an error!'
         });
    }
    try {
        db.query(`insert into contact (phoneNumber, email) 
        values(?, ?)`, [phoneNumber, email]);
    } catch(err) {
        return res.status(400).send({
            message: 'Error in inserting data'
         });
    }
    res.send('hurray!!!! message sent');
})

app.listen(3000, ()=> {
    console.log("listening to 3000");
})