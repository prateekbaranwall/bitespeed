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

const getData = async(phoneNumber, email)=> {
   return await db.query(` select * from contact where phoneNumber = ? OR email = ?`,[phoneNumber, email]);
}

app.post('/identity', async(req,res) => {
    const { email, phoneNumber } = req.body;
    if(!email && !phoneNumber) {
        return res.status(400).send({
            message: 'Please provide email or phoneNumber in body'
         });
    }
    try {
        const data = await getData(phoneNumber, email);
        if(data[0].length===0) {
             db.query(`insert into contact (phoneNumber, email, linkPrecedence) 
            values(?, ?, ?)`, [phoneNumber, email, "primary"]);
        } else {
            db.query(`insert into contact (phoneNumber, email, linkPrecedence, linkedId) 
            values(?, ?, ?, ?)`, [phoneNumber, email, "secondary", data[0][0].id]);
        }
       
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