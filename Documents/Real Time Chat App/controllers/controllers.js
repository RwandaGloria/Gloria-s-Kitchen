const express = require('express');
const router = express.Router();

const db = require('../db');
const order_items = require('../models/order_items');

let dishesAvailable = '';
let dishInformation = []
let total_price = 0
let orderBreakDown = '';
let order_Arr = [];
let id;
let dishInfo;
let sequenceIndex =0;


async function getAllDishes() {


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
    else if((order_Arr.length > 0 && sequenceIndex >= 1) && (data !== "99" && data !== '98' && data !== '97'))
    {
console.log(sequenceIndex);
console.log(typeof(data));
console.log(data);

        sequenceIndex +=1
        return await getAllOrderItems() +  `<br><br>Total price is ${total_price} <br>Do you need any other thing? If yes, type in orderNo and quantity '2, 3', If no, enter '99' to checkout`

    }
     if (data == "99"){

        return "Order placed"
    }else{
        return "Enter Valid Order"
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

async function createOrder(data) {
    //put in database. 
//get the order info. 

const order = await db.db.orders.create({

    status: 'ordered',
    date: 12,
    total_price: 0,
    updatedAt: Date.now
});

id = order.order_id;
console.log(order.order_id)

for(let i = 0; i< order_Arr.length; i++){

    const newItems = await order_items.create({

        dish_id: order_Arr[i],
        order_id: order.order_id

    })
}





}

module.exports = { getDishes, checkInput, convertInput}