const express = require('express');


const io = require('./app')
const items = require('./models/items');
const orders = require('./models/orders');
const users = require('./models/users');

const db = require('./db');
// const { app, io } = require('./app');


const arr = []

io.io.on('connect', (socket) => {
    socket.emit('msg', 'okay good')
})
// io.on('connection', function(socket) {
//     console.log('A user connected');
 
//     socket.emit('message', "Welcome to Gloria's Kitchen! 🥰❤️");
//     socket.emit('message', `We're delighted to have you visit our kitchen 😊 <br><br>Please press the following options to get started with us! <br>Type 1 to place an order <br><br>Type in 99 to checkout order <br><br>Type in 98 to see order history <br><br><br>Type in 97 to see current order <br><br>Type in 0 to cancel an order.`)

    
//     // socket.on('incoming_data', (data) => { 
//     //     console.log(data)
//     // })
//     //Whenever someone disconnects this piece of code executed
//     socket.on('disconnect', function () {
//        console.log('A user disconnected');
//     });
//  });

async function userCreateOrder(userId, dishArr, quantities)
{
const userId = req.body.userId;
const dishArr = req.body.dishArr;
const qty = req.body.qty;

const dishArray = JSON.parse(dishArr);
arr.push(dishArray);


db.orders.create({
    date: Date.now
})


//get [[1, 2], [2, 1]]
//Now get 

}



//fetch all items from database
//methods


