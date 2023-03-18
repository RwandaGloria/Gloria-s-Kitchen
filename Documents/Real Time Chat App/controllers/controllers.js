const express = require('express');
const session = require('express-session');
const { where } = require('sequelize');
const router = express.Router();

const db = require('../db');
const order_items = require('../models/order_items');
const uuid = require('uuid')
const deviceId = uuid.v4();

let dishesAvailable = '';
let dishInformation = []
let total_price = 0
let orderBreakDown = '';
let order_Arr = [];
let id = 0;
let dishInfo;
let sequenceIndex = 0;

if(session.deviceId == null) {
    session.deviceId = deviceId;
} 

async function getAllDishes() {

    if(session.deviceId) {
        console.log("true")
    }
   

    const getAllDishes = await getDishes()
  
    // console.log(getAllDishes);
    for(let i = 0; i < getAllDishes.length; i++){

        let dishName = getAllDishes[i].dataValues.dish_name 
        let price = getAllDishes[i].dataValues.price;
      dishesAvailable += `<br>[${i + 1}} ${dishName.padStart(45)}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${price.padEnd(50)}<br> \n`

    }
    return `Here are our special dishes available at the moment🍽️😋<br>` + dishesAvailable

    // console.log(dishesAvailable)
  }

  


async function getDishes(){
    console.log(session.deviceId, "is the session device ID")
    const getAllDishes = await db.db.dishes.findAll();
    return getAllDishes

}
async function convertInput(string){

    const arr = string.split('');
    console.log(arr)
    return arr

}


async function checkInput(data){

    const dataToArr = data.split('');
   
    if(dataToArr.length >= 3) {
        
        order_Arr.push(dataToArr)
    }
    console.log(order_Arr)
    if(data ==='1') {
     
        sequenceIndex+=1
        console.log(sequenceIndex)
        return await getAllDishes() + `Enter the item number and the quantity, for example "1 3" `;
        
  
    }
    else if((order_Arr.length > 0 && sequenceIndex >= 1) && (data !== "99" && data !== '98' && data !== '97'  && data !== '0'))
    {
console.log(sequenceIndex);
console.log(typeof(data));
console.log(data);

        sequenceIndex +=1
        return await getAllOrderItems() +  `<br><br>Total price is ${total_price} <br>Do you need any other thing? If yes, type in orderNo and quantity '2, 3', If no, enter '99' to checkout`

    }
     if (data == "99"){

       createOrder()
        return "Order placed"
    }
    else if (data == "97") {

    }
    else if(data == "98"){

        // if(session.dde)
      return checkOrderHistory(data)
    }
    else if (data == "0"){

        return cancelOrders(id);
    }
    else if((typeof(data)== "string") | data.length == 3){
        order_Arr = []
     return "Enter Valid Numbers<br> You can enter in this '1 3' to order three plates of Egusi Soup"
    }
   
    else{
        return "Enter Valid Numbers<br> You can enter in this '1 3' to order three plates of Egusi Soup"
    }


}

async function getAllOrderItems() {

    total_price = 0;

    for(let i = 0; i< order_Arr.length ; i++){

        console.log("i is ", i)
        console.log('order is', order_Arr[i][0])
        let dishId = order_Arr[i][0]
       let dishQty = order_Arr[i][2]
       
  
   const findDish = await db.db.dishes.findOne({where: {dish_id: dishId }});
//
   const dishPrice = findDish.dataValues.price;
const sum_total = dishPrice * dishQty;

total_price +=sum_total
dishInfo = [findDish.dish_name,  dishQty, sum_total];


    }
    dishInformation.push(dishInfo);
    console.log(dishInformation)
    return dishInformation

}

async function createOrder() {
    //put in database. 
//get the order info. 

const newUser = await db.db.users.create({

    user_id: session.deviceId,
    createdAt: Date.now(),
    updatedAt: Date.now()
})

const order = await db.db.orders.create({

    status: 'ordered',
    date: 12,
    total_price: 0,
    updatedAt: Date.now, 
    userUserId: newUser.user_id

});

id = order.order_id;
console.log(order.order_id)

for(let i = 0; i< order_Arr.length; i++){

    const newItems = await db.db.order_items.create({

        dish_id: order_Arr[i][0],
        order_id: order.order_id, 
        qty: order_Arr[i][2],
        createdAt: Date.now(),
        updatedAt: Date.now()
    })

    

    console.log("order succesful!")
}

const updateOrderPrice = await db.db.orders.update({ total_price : total_price}, {where: {order_id : id}});



}


async function cancelOrders() 
{
    //get the order ID. and it and upate it. 
    
    console.log(order_Arr);
    console.log(id);
    if(order_Arr.length === 0 && (id === 0)) { return "Place an order first!"}

    if(order_Arr.length > 0 && (id == 0)){

        order_Arr = []
        return "Order Now Cancelled. If you would like to order again. Press 1"
    }
    const newStatus = "cancelled"
    const findAndUpdateOrder = await db.db.orders.update({ status: newStatus }, {where : { order_id: id}})
    console.log("Update was successful!");
    return `Your current order  has been cancelled`
}

async function checkOrderHistory(data) {

    try{
    if((session.deviceId == null)) { return "Nothing to see. Press 1 to order now"}
    const deviceId = session.deviceId;

 
    //find the orders with unique id and send back. 
    const findOrder =await db.db.orders.findAll({where: { userUserId : deviceId}}
        )
   
        if( findOrder == null) {
            return "No orders yet. Press 1 to order now. "
        }

        console.log('FindOrder is', findOrder)
     
    const orderItems = await db.db.order_items.findAll({
        where: {
          order_id: findOrder.dataValues.order_id
        }
      });
      console.log("orderItems is ", orderItems)
      return orderItems
    

    } catch(err) {
        return err
    }
    
}


module.exports = { getDishes, checkInput, convertInput}