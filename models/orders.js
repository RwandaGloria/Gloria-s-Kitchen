const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const orders = sequelize.define("orders", {
   
       order_id: {

            type: DataTypes.BIGINT.UNSIGNED,
            required: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status:{
            type: DataTypes.ENUM('ordered', 'failed', 'cancelled'),
            required: false, 
            defaultValue: 'ordered',
            allowNull: false},
        



total_price:{
    type:DataTypes.DECIMAL,
    defaultValue:0
},
date: {
    type: DataTypes.INTEGER,
    defaultValue: Date.now
}
    });
    return orders;
    
  };