
const db = require('./database');

const getDataOnPhoneNumber = async (phoneNumber)=> {
    return await db.query(` select * from contact where phoneNumber = ? limit 1`,[phoneNumber]);
 }

 const getAllDataOnPhoneNumberExceptPrimary = async (phoneNumber)=> {
    return await db.query(` select * from contact where phoneNumber = ? AND linkPrecedence='secondary'`,[phoneNumber]);
 }

 const getAllDataOnEmailExceptPrimary = async (email)=> {
    return await db.query(` select * from contact where email = ? AND linkPrecedence='secondary'`,[email]);
 }

 const getDataOnEmail = async ( email)=> {
    return await db.query(` select * from contact where email = ? limit 1`,[email]);
 }

 const getDataById = async (id)=> {
    return await db.query(` select * from contact where id=?`,[id]);
 }
 
 const updateLinkPrecedence = async(id, linkedId) => {
     try{
         await db.query(`update contact set linkPrecedence='secondary', linkedId=? where id=?`, [linkedId, id]);
     } catch(e) {
         console.log(e);
     }
 }

 const findPrimaryContact = async(id)=> {
    const q =  await db.query(` select * from contact where id=?`,[id]);
    if(q[0].length===0) return;
    if(!q[0][0].linkedId || q[0][0].linkedId==id) {
      return q[0];
     }
    return findPrimaryContact(q[0][0].linkedId);
 }
 

 module.exports = {
    getDataOnPhoneNumber,
    getDataOnEmail,
    getDataById,
    updateLinkPrecedence,
    getAllDataOnPhoneNumberExceptPrimary,
    getAllDataOnEmailExceptPrimary,
    findPrimaryContact
 }