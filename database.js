const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const con = mysql.createConnection({ 
    host: process.env.SQL_SERVER, 
    user: process.env.SQL_USER, 
    password: process.env.SQL_PASSWORD, 
    database: 'bitespeed' 
}).promise();
     
con.connect(function (err) { 
    if (err) { 
        console.log(err); 
    } else { 
        const sql = 'CREATE TABLE contact (id int, name varchar(20), email varchar(100), linkedId int, linkPrecedence varchar(20))'; 
        con.query(sql, (err, result) => { 
            if (err) { 
                // console.log(err) 
            } else { 
                console.log("Table created"); 
            } 
        }) 
    } 
})
module.exports = con;