const express = require('express');
const route = express.Router();
const { conn } = require('../db');
const authenticate = require('../middleware');

const generateQuery = (targetFields, updateData, taskId, userId) => {
    let len = targetFields.length;
    
    let query = "UPDATE tasks SET ";

    for(let i = 0; i < len; i++){
        query = query + `${targetFields[i]} = '${updateData[i]}'`;
        if(i < len - 1){
            query = query + ', ';
        } 
    }
    query = query + ` WHERE taskId = '${taskId}' AND userId = '${userId}';`;

    return query;
}

route.patch('/:taskId', authenticate, async (req, res) => {
    // Extract TaskId, userId, newData
    const { taskId } = req.params;
    const { userId, data } = req.body;

    if(!taskId || !userId ){
        return res.status(400).json({ error: "Unable to find the task" });
    }

    try{
        const targetFields = Object.keys(data);
        const updateData = Object.keys(data).map(key => data[key]);

        const query = generateQuery(targetFields, updateData, taskId, userId);

        await conn.query(query)
        .catch((err) => {
            console.log(err);
        })

        return res.status(200).json({ message: "Task Updated" });
    }
    catch(err){
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = route;