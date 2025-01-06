const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const {conn} = require('../db');
const { client } = require('../redis');


router.post('/', async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({ error: "Missing Fields" });
    }

    try{
        // Generate Unique User ID
        const userId = uuid.v4();

        // Store the userId in the cache as the Id is active 
        const cacheStatus = await client.SADD('active_users', userId)
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ Error: "Failed to add user to active users" });
        });

        if(cacheStatus === 0){
            return res.json({ message: "Session already active"});
        }

        // hash the password
        const hashedPswd = await bcrypt.hash(password, 10);

        // Check if user already exists
        const foundRecord = await conn.query('SELECT * from users WHERE email = $1', [email]);

        if(foundRecord.rows.length > 0){
            return res.status(400).json({ message: "E-mail already exists" });
        }
        
        // store the info in db using INSERT statement
        conn.query('INSERT INTO users (userId, name, email, password) values ($1, $2, $3, $4);', [userId, name, email, hashedPswd])
        .catch((err) => {
            console.log(err);
        });

        return res.status(200).json({ message: "User Registered" });
    }  
    catch(err){
        return res.status(400).json({ error: "Internal Server Error" });
    }
});

module.exports = router;