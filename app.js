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

const getData = async (phoneNumber, email)=> {
   return await db.query(` select * from contact where phoneNumber = ? OR email = ? order by createdAt ASC`,[phoneNumber, email]);
}

const updateLinkPrecedence = async(id, linkedId) => {
    try{
        await db.query(`update contact set linkPrecedence='secondary', linkedId=? where id=?`, [linkedId, id]);
    } catch(e) {
        console.log(e);
    }
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
        // console.log(data[0]);
        if(data[0].length===0) {
             db.query(`insert into contact (phoneNumber, email, linkPrecedence) 
            values(?, ?, ?)`, [phoneNumber, email, "primary"]);
        } else {
            let flag=0;
            data[0].forEach(element=>{
                if(element.linkPrecedence=='primary' && flag===0) {flag=1; linkedId = element.id; }
                else if(flag===1 && element.linkPrecedence=='primary' ) updateLinkPrecedence(element.id, linkedId);
            })
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