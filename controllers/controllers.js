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
let order_ids = [];
let id = 0;
let dishInfo;
let sequenceIndex = 0;

if(session.deviceId == null) {
    session.deviceId = deviceId;
} 


function setRequest(request) {
    req = request;
    return req
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


async function checkInput(data, req){


    const findUser = await db.db.users.findOne({where: {user_id: session.deviceId}});
    if(findUser == null ) {

        const newUser = await db.db.users.create({

            user_id: session.deviceId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
    }

    const dataToArr = data.split('');
   
    if(dataToArr.length >= 3) {
        
        order_Arr.push(dataToArr)
    }
    console.log(order_Arr)
    if(data ==='1') {
     
        order_Arr = [];
        dishInformation = []
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

      return createOrder()
  
    }
    else if (data == "97") {

        if(order_Arr.length == 0) {
            return "No current order placed. Press 1 to get started with placing orders"
        }
        return getAllOrderItems()
    }
    else if(data == "98"){

        // if(session.dde)
      return checkOrderHistory(data, req)
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
dishInfo = [findDish.dish_name,  `    ${dishQty}`, `  price : ${sum_total}`];


    }
    dishInformation.push(dishInfo);
    console.log(dishInformation)
    return dishInformation

}

async function createOrder() {
    //put in database. 
//get the order info. 

if(order_Arr.length === 0) {

    return "Select your items first before placing an order. Click 1 to get started."
}
const order = await db.db.orders.create({

    status: 'ordered',
    date: 12,
    total_price: 0,
    updatedAt: Date.now, 
    userUserId: session.deviceId

});

id = order.order_id;
order_ids.push(id);
session.orderIDs = order_ids
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
    return "Order Placed"

}

const updateOrderPrice = await db.db.orders.update({ total_price : total_price}, {where: {order_id : id}});



}



async function cancelOrders() 
{
    //get the order ID. and it and upate it. 
    order_Arr = []
    console.log(order_Arr);
    console.log(id);
    if(order_Arr.length === 0 && (id === 0)) { return "Place an order first!"}

    if(order_Arr.length > 0 && (id == 0)){

       
        return "Order Now Cancelled. If you would like to order again. Press 1"
    }
    const newStatus = "cancelled"
    const findAndUpdateOrder = await db.db.orders.update({ status: newStatus }, {where : { order_id: id}})
    console.log("Update was successful!");
    return `Your current order  has been cancelled`
}

async function checkCurrentOrder() {

    
}

async function checkOrderHistory(data, req) {

    let deviceId = session.deviceId
  
        const findCustomer = await db.db.users.findOne({where: {user_id : deviceId}});
    
        if(findCustomer == null ){
            return "No orders placed. press 1 to place an order"
        }

        const findOrder =await db.db.orders.findAll({where: { userUserId : findCustomer.user_id}}
            )
       
            if( findOrder.length === 0) {
                return "No orders yet. Press 1 to order now. "
            }
            //Get all order items from findOrder. 
// console.log(findOrder)

const orderIDs = session.orderIDs;
            let orderDetails = []

            for (let i = 0; i< order_ids.length; i++) {

                console.log(i)
                console.log(orderIDs)
                const orderItems = await db.db.order_items.findAll({
                    where: {
                      order_id: orderIDs[i]
                    }
                  });
       console.log(orderItems);
                  const orderStock = orderItems[0].dataValues;
                  console.log(orderStock);
                  //print all order items with total price to an empty string. 

                  const findDishById= await db.db.dishes.findOne({where: {dish_id : orderItems[0].dataValues.dish_id}})

                  
                  const dishName = findDishById.dish_name
                  const dishqty = orderStock.qty

                  const getOrderById = await db.db.orders.findOne({where: {order_id : orderIDs[i]}})

                  const getPrice = getOrderById.total_price;

                  orderDetails.push([dishName, dishqty])
                  console.log(orderItems);
            }
            return `Here are your previous orders: <br><br>` + orderDetails + `<br> Total Price is ${total_price}`
           
    
}


module.exports = { getDishes, checkInput, convertInput}