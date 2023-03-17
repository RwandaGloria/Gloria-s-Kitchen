const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const order_items = sequelize.define("order_items", {
   
        id: {

            type: DataTypes.BIGINT.UNSIGNED,
            required: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
      dish_id :{
        type: DataTypes.BIGINT.UNSIGNED
      }, 
      order_id:{
        type: DataTypes.BIGINT.UNSIGNED
      }, 
      qty:{
          type: DataTypes.INTEGER
      }

    });
 
    return order_items;
    
  };