const express = require('express')
const cors = require('cors');
const db = require('./database');
const app = express();
const dotenv=require('dotenv');
const bodyParser = require('body-parser')
const {getData, updateLinkPrecedence, getDataById, getDataOnPhoneNumber, getDataOnEmail, getAllDataOnPhoneNumberExceptPrimary, getAllDataOnEmailExceptPrimary, findPrimaryContact} = require('./service')
dotenv.config();

app.use(cors());
app.use(bodyParser.json());


app.post('/identity', async(req,res) => {
    const { email, phoneNumber } = req.body;
    if(!email && !phoneNumber) {
        return res.status(400).send({
            message: 'Please provide email or phoneNumber in body'
         });
    }
    try {
        let phonePrimary, emailPrimary;
        if(phoneNumber) {
           let dataPhoneNumner = await getDataOnPhoneNumber(phoneNumber);
           if(dataPhoneNumner[0].length)
             phonePrimary = await findPrimaryContact(dataPhoneNumner[0][0].id);
        }
       
        if(email) {
           dataEmail = await getDataOnEmail(email);
           if(dataEmail[0].length) {
              emailPrimary = await findPrimaryContact(dataEmail[0][0].id);
           }
        }

        if(!emailPrimary && !phonePrimary) {
            const contactData = await db.query(`insert into contact (phoneNumber, email, linkPrecedence) 
            values(?, ?, ?)`, [phoneNumber, email, "primary"]);
            const insertedId = contactData[0].insertId;
            const getData = await getDataById(insertedId);
            const finalData = {
                contact: {
                    primaryContatctId: getData[0][0].id,
                    emails: [getData[0][0].email],
                    phoneNumbers: [getData[0][0].phoneNumber],
                    secondaryContactIds: [],
                }
            }
            res.status(200).send(finalData);
        } else {

            let primary;
            if(emailPrimary && phonePrimary) {
                if(emailPrimary[0].createdAt < phonePrimary[0].createdAt) {
                    primary = emailPrimary[0];
                    updateLinkPrecedence(phonePrimary[0].id, primary.id);
                } else {
                    primary = phonePrimary[0];
                    updateLinkPrecedence(emailPrimary[0].id, primary.id);
                }
            }
            else if(emailPrimary) primary = emailPrimary[0];
            else primary = phonePrimary[0];

            const phoneExceptPrimary = (await getAllDataOnPhoneNumberExceptPrimary(phoneNumber))[0];
            const emailExceptPrimary = (await getAllDataOnEmailExceptPrimary(email))[0];

            const emails = new Set();
            const phoneNumbers =  new Set();
            const secondaryContactIds =  new Set();

            phoneExceptPrimary.forEach(e=>{
                phoneNumbers.add(e.phoneNumber);
                emails.add(e.email);
                secondaryContactIds.add(e.id);
            })

            emailExceptPrimary.forEach(e=>{
                phoneNumbers.add(e.phoneNumber);
                emails.add(e.email);
                secondaryContactIds.add(e.id);
            })

            const contactData = await db.query(`insert into contact (phoneNumber, email, linkPrecedence, linkedId) 
            values(?, ?, ?, ?)`, [phoneNumber, email, "secondary", primary.id]);
            // Adding data of current contact

            if(phoneNumber)
               phoneNumbers.add(phoneNumber);
            if(email)
               emails.add(email);
            secondaryContactIds.add(contactData[0].insertId);
            phoneNumbers.delete(primary.phoneNumber);
            emails.delete(primary.email);

            const phoneArray = [primary.phoneNumber, ...phoneNumbers];
            const emailArray = [primary.email, ...emails];
            const secondaryIdArray = [...secondaryContactIds];

            const finalData = {
                contact: {
                    primaryContatctId: primary.id,
                    emails: emailArray,
                    phoneNumbers: phoneArray,
                    secondaryContactIds: secondaryIdArray,
                }
            }
            res.status(200).send(finalData);
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