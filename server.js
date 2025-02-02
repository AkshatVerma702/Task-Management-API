const express = require('express');
const app = express();
const {connectDB} = require('./db');
const { redisSetup } = require('./redis');

const port = process.env.port || 5000;

app.use(express.json());


const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const createTaskRoute = require('./routes/createTask');
const showTasksRoute = require('./routes/showTasks');
const deleteTasksRoute = require('./routes/deleteTask');
const updateTaskRoute = require('./routes/updateTask');
const signoutRoute = require('./routes/signout');

app.use('/routes/login', loginRoute);
app.use('/routes/register', registerRoute);
app.use('/routes/createTask', createTaskRoute);
app.use('/routes/showTasks', showTasksRoute);
app.use('/routes/deleteTask', deleteTasksRoute);
app.use('/routes/updateTask', updateTaskRoute);
app.use('/routes/signout', signoutRoute);


app.listen(port, async () => {
    console.log(`Server listening on ${port}`);
    connectDB();
    redisSetup();
})