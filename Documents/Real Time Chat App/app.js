const express = require('express');
const socket = require('socket.io');
const path = require('path');
const app = express();
require('dotenv').config()
const PORT = 9099 || process.env.PORT;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./db');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const router = require('./routes');

const controllers = require('./controllers/controllers');

app.use(express.json())
app.use(router)
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

connectServer();



const expiryDate = 1000 * 60 * 60 * 500;
app.use(sessions({
    secret: process.env.SECRETKEY,
    saveUninitialized:true,
    cookie: { maxAge: expiryDate },
    resave: false 
}));


io.on('connection', function(socket) {
    console.log('A user connected');
 
    socket.emit('message', "Welcome to Gloria's Kitchen! 🥰❤️");
    socket.emit('message', `We're delighted to have you visit our kitchen 😊 <br><br>Please press the following options to get started with us! <br>Type 1 to place an order <br><br>Type in 99 to checkout order <br><br>Type in 98 to see order history <br><br><br>Type in 97 to see current order <br><br>Type in 0 to cancel an order.`)

    
    socket.on('incoming_data', async (data) => { 
        
        
        const result = await controllers.checkInput(data)

        // console.log(result)
        socket.emit('input', result);
        // socket.emit('response_msg_1', "☝️Enter in the numbers to order any of the dishes and the amount you would like for an item like this, '1 3' or '2, 4' --> 4 plates of Ewagoyin beans")
    })

    socket.on('response_client_msg_2', (data) => {

        const arr = controllers.convertInput(data);
    })
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
 });

function connectServer () {

    http.listen(PORT, () => {

        console.log("Server connected successfully!");
    })
}




module.exports = {io, app}