const express = require('express');
const socket = require('socket.io');
const path = require('path');
const app = express()
require('dotenv').config()
const PORT = 9099 || process.env.PORT;
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

connectServer();



io.on('connection', function(socket) {
    console.log('A user connected');
 
    socket.emit('message', "Welcome to Gloria's Kitchen! 🥰❤️");
    socket.emit('message', `We're delighted to have you visit our kitchen 😊 <br><br>Please press the following options to get started with us! <br>Type 1 to place an order <br><br>Type in 99 to checkout order <br><br>Type in 98 to see order history <br><br><br>Type in 97 to see current order <br><br>Type in 0 to cancel an order.`)
    
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