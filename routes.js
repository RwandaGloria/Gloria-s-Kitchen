const express = require('express');
const router = express.Router();
const items = require('./models/items');
const orders = require('./models/orders')
const order_items = require('./models/order_items');
const db = require('./db')

const order_= []
let id = 0
let total_price =0
let orderBreakDown = '';
const dish = 'Dish';
const Qty = 'Qty';
const Price = 'Price';
const dishInformation = []

let dishesAvailable = ''
router.get('/fetch/dishes', async(req, res) => {


    const getAllDishes = await db.db.dishes.findAll();
  
    // console.log(getAllDishes);
    for(let i = 0; i < getAllDishes.length; i++){

        let dishName = getAllDishes[i].dataValues.dish_name 
        let price = getAllDishes[i].dataValues.price;
      dishesAvailable += `${dishName.padStart(45)} ${price.padEnd(20)}\n`
    }

    console.log(dishesAvailable);
})
router.post('/fetch/items', async (req, res) =>
{

    let dishId = req.body.dishId
    let dishqty = req.body.dishqty;

    const dishOrder = [dishId,  dishqty]
    order_.push(dishOrder);
  
    console.log(order_)


 })


router.post('/calculate', async (req, res) => {
  
const order = await db.db.orders.create({

    status: 'ordered',
    date: 12,
    total_price: 0,
    updatedAt: Date.now

})


id = order.order_id;
console.log(order.order_id)


for(let i = 0; i< order_.length ; i++){

    let dishId = order_[i][0]
   let dishQty = order_[i][1]

//    console.log(order_);
//    console.log(order_[i][0]);
   const findDish = await db.db.dishes.findOne({where: {dish_id: dishId }});
   if(!findDish){ throw new Error}
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
const updateOrderPrice = await db.db.orders.update({ total_price : total_price}, {where: {order_id : id}});

console.log('Successfully updated record! ')


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


})

module.exports = router