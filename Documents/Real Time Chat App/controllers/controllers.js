const express = require('express');
const router = express.Router();

const db = require('../db');

let dishesAvailable = '';
let dishInformation = []
let total_price = 0
let orderBreakDown = '';
let order_Arr = [];
let id 

async function getDishes(){
    const getAllDishes = await db.db.dishes.findAll();
    return getAllDishes

}

//convert input from string to an array for the next method 
async function convertInput(string){

    const arr = string.split('');
    console.log(arr)
    return arr

}

//Get input from user. 
//Get input from user. 
async function handleInput(data){
    const array = await convertInput(data);
    if(!array) { throw new Error }
    
    if(array.length !== 2 || isNaN(array[0]) || isNaN(array[1])) {
      throw new Error("Invalid input format. Please enter in the format of 'x y', where x is the dish number and y is the quantity.");
    }
  
    const dishNumber = parseInt(array[0]);
    const dishQty = parseInt(array[1]);

    const dishes = await getDishes();
    if(dishNumber <= 0 || dishNumber > dishes.length) {
      throw new Error(`Invalid dish number. Please enter a number between 1 and ${dishes.length}.`);
    }

    const dishId = dishes[dishNumber - 1].dataValues.dish_id;
    await createOrder([dishId, dishQty]);
  }
  
// }

//the data received will be in an array format. 
async function createOrder(data) {
//first get dish item and then get the info for the quantity. 
console.log('order Array is',order_Arr);

const order = await db.db.orders.create({

    status: 'ordered',
    date: 12,
    total_price: 0,
    updatedAt: Date.now

})


id = order.order_id;
console.log(order.order_id)


for(let i = 0; i< order_Arr.length ; i++){

    let dishId = order_Arr[i][0]
   let dishQty = order_Arr[i][2]

//    console.log(order_);
//    console.log(order_[i][0]);
   const findDish = await db.db.dishes.findOne({where: {dish_id: dishId }});
   if(!findDish){ throw new Error}
   console.log(findDish.dish_name);
   console.log('dish ID is', dishId)



const dishPrice = findDish.dataValues.price;
const sum_total = dishPrice * dishQty;
const dishInfo = [findDish.dish_name,  dishQty, sum_total];
dishInformation.push(dishInfo);



total_price +=sum_total;

console.log(total_price);


const update = await db.db.order_items.create({

    dish_id : dishId,
    order_id: id,
    qty: dishQty, 
    createdAt: Date.now(), 
    updatedAt: Date.now()
});



}
for (let i = 0; i < dishInformation.length; i++)
{

  const dishName = dishInformation[i][0];
  const dishQty = dishInformation[i][1];
  const dish_price = dishInformation[i][2];
    

  orderBreakDown +=`${dishName.toString().padEnd(45)} ${dishQty.toString().padStart(10)} ${dish_price.toString().padStart(20)} \n `  
}
console.log(orderBreakDown);
// console.log(` ${dish.padEnd(45)} ${Qty.padStart(10)} ${Price.padStart(20)}  \n ${findDish.dish_name}`   )



}



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
  let sequenceIndex = 0;
  
  async function checkInput(data) {

 
    const dataToArr = data.split('');
    if(dataToArr.length == 3){

   order_Arr.push(dataToArr);

    }
    console.log(dataToArr)
    if (data === '1') {
        sequenceIndex+=1
      return await getAllDishes();
    }
    else if (Array.isArray(dataToArr) && dataToArr.length >= 3 && sequenceIndex == 1 ){

        sequenceIndex +=1
        console.log(sequenceIndex + 'is');
        console.log(order_Arr)
      return await createOrder(order_Arr) + `<br>Do you need anything else? If yes, type in orderNo and quantity '2, 3`
        // return "It's totally fine"
    }
    else if( sequenceIndex > 1) {

        return "Do you need anything other thing? If yes, type in orderNo and quantity '2, 3'"
    }
    else {
        return "Invalid Entry! Enter in one of the following numbers: 1, 99, 98, 97, 0"
    }
  }
  


module.exports = { getDishes, checkInput, convertInput, createOrder}