const express = require('express');
const router = express.Router();
const {conn} = require('../db');
const bcrypt = require('bcrypt');
const { client } = require('../redis');
const { resetExpire } = require('../resetExpiry');


const validateData = async ( password, record ) => {
    const hash = record.rows[0].password;

    // Store the hashed password and compare it
    const check = await bcrypt.compare(password, hash);
    
    if(!check){
        return {
            valid: false,
            message: "Please Enter Correct Password"
        }
    }

    return {
        valid: true,
        message: "Login Success"
    };
}

router.post('/', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ Error: "Enter all the details "});
    }

    try{
        const record = await conn.query(`SELECT password, userId FROM users WHERE email = '${email}'`);
        
        const check = await validateData(password, record);
        
        if(!check.valid){
            return res.status(500).json({ Error: check.message })
        }

        resetExpire(record.rows[0].userid);
        
        const cacheStatus = await client.SADD('active_users', record.rows[0].userid);

        if(cacheStatus === 0){
            return res.status(200).json({ message: "Session already active" });
        }

        return res.status(200).json({ message: check.message });
    }
    catch(err){
        console.log(err);
        return res.status(400).json({ error: "Server Error" });
    }
});

module.exports = router;