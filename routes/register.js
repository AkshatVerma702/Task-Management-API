const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const {conn} = require('../db');


router.post('/', async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({ error: "Missing Fields" });
    }

    try{
        // Generate Unique User ID
        const userId = uuid.v4();

        // hash the password
        const hashedPswd = await bcrypt.hash(password, 10);

        if(!hashedPswd){
            return res.status(500).json({ message: "Unable to Store password" });
        }

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