const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const dish = sequelize.define("dish", {
   
        dish_id: {

            type: DataTypes.BIGINT.UNSIGNED,
            required: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        dish_name: {

            type: DataTypes.STRING,
            required: true,
            allowNull: true
        },
        price :{
            type: DataTypes.DECIMAL,
            required: false
        },
        isAvailable:{
            type: DataTypes.BOOLEAN,
            required: false, 
            allowNull: false

        }


    });
 
    return dish;
  };