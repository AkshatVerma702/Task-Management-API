const express = require('express');
const route = express.Router();
const {conn} = require('../db');
const authenticate = require('../middleware');
const { client } = require('../redis');

route.post('/', authenticate, async (req , res) => {
    const {title, description, dueDate, userId} = req.body;
    
    if(!title || !description || !dueDate){
        return res.status(400).json({message: "Unable to create the Task"});
    }

    try{
        const result = await conn.query(`INSERT INTO tasks (title, description, status, dueDate, userId) VALUES ($1, $2, $3, $4, $5) RETURNING taskId;`, [title, description, 'pending', dueDate, userId])
        .catch((err) => {
            console.log(err);
        });

        const taskId = result.rows[0].taskid;

        const task = {
            title: title,
            description: description,
            status: 'pending',
            dueDate: dueDate
        }

        await client.HSET(`all_tasks:${userId}`, taskId.toString(), JSON.stringify(task));
        
        return res.status(200).json({ message: "New task Created" });
    }
    catch(err){
        return res.status(500).json({ Error: "Internal Server Error" });
    }
});

module.exports = route;